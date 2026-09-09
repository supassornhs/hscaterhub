import { promises as fs } from "node:fs";
import path from "node:path";
import { createInterface } from "node:readline/promises";
import { pathToFileURL } from "node:url";
import {
  ClubFeastApiError,
  listAllPackages,
  listRestaurants,
} from "./clubfeast_api.js";
import { CLUBFEAST_BEARER_TOKEN } from "./clubfeast_config.js";

export function parseArguments(argv) {
  const options = {
    output: "scratch/clubfeast_latest_raw.json",
    pageSize: 100,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--out") options.output = argv[++index];
    else if (argument === "--page-size") {
      options.pageSize = Number.parseInt(argv[++index], 10);
    } else if (argument === "--from") options.from = argv[++index];
    else if (argument === "--to") options.to = argv[++index];
    else throw new Error(`Unknown argument: ${argument}`);
  }

  if (!options.output) throw new Error("--out requires a path");
  if (!Number.isInteger(options.pageSize) || options.pageSize < 1) {
    throw new Error("--page-size must be a positive integer");
  }

  return options;
}

function validateDate(value, label) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) {
    throw new Error(`${label} must use YYYY-MM-DD format`);
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new Error(`${label} must be a real calendar date`);
  }

  return value;
}

export async function resolveDateRange(
  options,
  {
    interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY),
    prompt,
    onInvalid = (message) => process.stderr.write(`${message}\n`),
  } = {},
) {
  if ((!options.from || !options.to) && !interactive) {
    throw new Error(
      "A date range is required. Pass --from YYYY-MM-DD and --to YYYY-MM-DD when running non-interactively.",
    );
  }

  let readline;
  const ask = prompt ?? (async (question) => {
    readline ??= createInterface({ input: process.stdin, output: process.stdout });
    return (await readline.question(question)).trim();
  });

  async function promptForValidDate(question, label) {
    for (;;) {
      try {
        return validateDate((await ask(question)).trim(), label);
      } catch (error) {
        onInvalid(error.message);
      }
    }
  }

  try {
    const from = options.from
      ? validateDate(options.from, "from")
      : await promptForValidDate("from (YYYY-MM-DD): ", "from");

    let to = options.to
      ? validateDate(options.to, "to")
      : await promptForValidDate("to (YYYY-MM-DD): ", "to");

    while (to < from) {
      if (options.to) throw new Error("to must be on or after from");
      onInvalid("to must be on or after from");
      to = await promptForValidDate("to (YYYY-MM-DD): ", "to");
    }

    return { ...options, from, to };
  } finally {
    readline?.close();
  }
}

async function writeJsonAtomically(outputPath, value) {
  const absolutePath = path.resolve(outputPath);
  const temporaryPath = `${absolutePath}.${process.pid}.tmp`;
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`);
  await fs.rename(temporaryPath, absolutePath);
  return absolutePath;
}

async function extract(options) {
  const filters = {
    delivery_window_start: options.from,
    delivery_window_end: options.to,
  };
  let packages;

  try {
    const restaurants = await listRestaurants(CLUBFEAST_BEARER_TOKEN);
    const packagesByRestaurant = await Promise.all(
      restaurants.map(async (restaurant) => {
        const restaurantPackages = await listAllPackages(
          CLUBFEAST_BEARER_TOKEN,
          {
            pageSize: options.pageSize,
            restaurantId: restaurant.id,
            filters,
          },
        );

        return restaurantPackages.map((item) => ({
          ...item,
          source_restaurant: {
            id: restaurant.id,
            title: restaurant.title,
            address_line: restaurant.address?.address_line ?? "",
            city: restaurant.address?.city ?? "",
            discount_percentage: restaurant.discount_percentage,
          },
        }));
      }),
    );
    packages = packagesByRestaurant
      .flat()
      .sort((left, right) =>
        String(right.delivery_window_end ?? "").localeCompare(
          String(left.delivery_window_end ?? ""),
        ),
      );
  } catch (error) {
    if (error instanceof ClubFeastApiError && error.status === 401) {
      throw new Error(
        "The hardcoded ClubFeast token has expired. Login automation is paused; replace CLUBFEAST_BEARER_TOKEN before rerunning.",
      );
    }
    throw error;
  }

  const outputPath = await writeJsonAtomically(options.output, packages);
  process.stdout.write(
    `Extracted ${packages.length} ClubFeast past-order records across all account locations to ${outputPath}\n`,
  );
}

async function main() {
  try {
    const options = await resolveDateRange(parseArguments(process.argv.slice(2)));
    await extract(options);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
