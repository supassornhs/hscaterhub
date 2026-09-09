import assert from "node:assert/strict";
import test from "node:test";
import * as clubFeastApi from "./clubfeast_api.js";
import {
  ClubFeastApiError,
  listAllPackages,
  listPackagesPage,
  listRestaurants,
} from "./clubfeast_api.js";
import {
  CLUBFEAST_BEARER_TOKEN,
  CLUBFEAST_RESTAURANT_ID,
} from "./clubfeast_config.js";
import { resolveDateRange } from "./clubfeast_extract.js";

test("interactive extraction prompts for from and then to", async () => {
  const questions = [];
  const answers = ["2026-04-01", "2026-04-30"];

  const options = await resolveDateRange(
    { output: "output.json", pageSize: 100 },
    {
      interactive: true,
      prompt: async (question) => {
        questions.push(question);
        return answers.shift();
      },
    },
  );

  assert.deepEqual(questions, [
    "from (YYYY-MM-DD): ",
    "to (YYYY-MM-DD): ",
  ]);
  assert.equal(options.from, "2026-04-01");
  assert.equal(options.to, "2026-04-30");
});

test("explicit date flags bypass interactive prompts", async () => {
  const options = await resolveDateRange(
    { from: "2026-05-01", to: "2026-05-31" },
    {
      interactive: true,
      prompt: async () => {
        throw new Error("prompt should not run when both dates are supplied");
      },
    },
  );

  assert.equal(options.from, "2026-05-01");
  assert.equal(options.to, "2026-05-31");
});

test("the restaurant packages request uses the exact verified HTTP contract", async () => {
  let captured;
  const fetchImpl = async (url, options) => {
    captured = { url: new URL(url), options };
    return new Response("[]", { status: 200 });
  };

  await listPackagesPage("saved-token", {
    restaurantId: 3904,
    pageSize: 10,
    fetchImpl,
  });

  assert.equal(
    `${captured.url.origin}${captured.url.pathname}`,
    "https://www.clubfeast.com/api/v4/restaurant/packages",
  );
  assert.equal(captured.url.searchParams.get("restaurant_id"), "3904");
  assert.equal(captured.url.searchParams.get("page_number"), "0");
  assert.equal(captured.url.searchParams.get("page_size"), "10");
  assert.equal(captured.options.method, "GET");
  assert.equal(
    captured.options.headers.platform,
    "club-feast-restaurant:1.13",
  );
  assert.equal(captured.options.headers.Authorization, "Bearer saved-token");
});

test("package extraction paginates without changing discount data", async () => {
  const requests = [];
  const pages = [
    [
      {
        id: 1,
        adjusted_cost: -2225,
        cost_adjustment_reason: "Poor quality complaints",
        cost_summary: { volume_discount: "12.50" },
      },
      { id: 2 },
    ],
    [{ id: 3 }],
  ];
  const fetchImpl = async (url) => {
    requests.push(new URL(url));
    return new Response(JSON.stringify(pages[requests.length - 1]), {
      status: 200,
    });
  };

  const packages = await listAllPackages("saved-token", {
    restaurantId: 3904,
    pageSize: 2,
    fetchImpl,
  });

  assert.equal(requests.length, 2);
  assert.equal(requests[0].searchParams.get("page_number"), "0");
  assert.equal(requests[1].searchParams.get("page_number"), "1");
  assert.equal(packages[0].cost_summary.volume_discount, "12.50");
  assert.equal(packages[0].adjusted_cost, -2225);
  assert.equal(
    packages[0].cost_adjustment_reason,
    "Poor quality complaints",
  );
});

test("restaurant discovery returns every location exposed by the account", async () => {
  let captured;
  const fetchImpl = async (url, options) => {
    captured = { url: new URL(url), options };
    return new Response(
      JSON.stringify([
        { id: 3904, title: "Holy Shred (Dinner Menu)" },
        { id: 4198, title: "Holy Shred" },
        { id: 4088, title: "Holy Shred" },
      ]),
      { status: 200 },
    );
  };

  const restaurants = await listRestaurants("saved-token", { fetchImpl });

  assert.deepEqual(
    restaurants.map((restaurant) => restaurant.id),
    [3904, 4198, 4088],
  );
  assert.equal(
    `${captured.url.origin}${captured.url.pathname}`,
    "https://www.clubfeast.com/api/v4/restaurant/restaurants/",
  );
  assert.equal(captured.options.headers.Authorization, "Bearer saved-token");
});

test("structured API failures remain readable", async () => {
  const fetchImpl = async () =>
    new Response(
      JSON.stringify({ errors: [{ message: "Token has expired" }] }),
      { status: 401 },
    );

  await assert.rejects(
    () =>
      listPackagesPage("expired-token", {
        restaurantId: 3904,
        fetchImpl,
      }),
    (error) => {
      assert(error instanceof ClubFeastApiError);
      assert.equal(error.status, 401);
      assert.match(error.message, /HTTP 401: Token has expired/);
      return true;
    },
  );
});

test("the current prototype uses the hardcoded account credential", () => {
  assert.equal(CLUBFEAST_RESTAURANT_ID, 3904);
  assert.equal(typeof CLUBFEAST_BEARER_TOKEN, "string");
  assert(CLUBFEAST_BEARER_TOKEN.length > 100);
  assert.equal("requestAuthCode" in clubFeastApi, false);
  assert.equal("createSession" in clubFeastApi, false);
  assert.equal("verifySession" in clubFeastApi, false);
});
