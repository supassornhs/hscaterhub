const API_BASE_URL = "https://www.clubfeast.com/api";
const PLATFORM_HEADER = "club-feast-restaurant:1.13";

export class ClubFeastApiError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message);
    this.name = "ClubFeastApiError";
    this.status = status;
    this.payload = payload;
  }
}

function parsePayload(text) {
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function errorMessage(payload, status) {
  if (typeof payload === "string" && payload.trim()) return payload.trim();
  if (typeof payload?.message === "string") return payload.message;
  if (typeof payload?.error === "string") return payload.error;
  if (typeof payload?.error?.message === "string") return payload.error.message;
  if (Array.isArray(payload?.errors)) {
    const messages = payload.errors
      .map((error) => {
        if (typeof error === "string") return error;
        if (typeof error?.message === "string") return error.message;
        if (typeof error?.detail === "string") return error.detail;
        return JSON.stringify(error);
      })
      .filter(Boolean);
    if (messages.length) return messages.join(", ");
  }

  if (payload && typeof payload === "object") {
    try {
      return JSON.stringify(payload);
    } catch {
      // Fall through to the status-only message.
    }
  }
  return `ClubFeast API returned HTTP ${status}`;
}

async function request(
  path,
  { method = "GET", token, body, query, fetchImpl = globalThis.fetch } = {},
) {
  const url = new URL(`${API_BASE_URL}${path}`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null || value === "") continue;

    if (Array.isArray(value)) {
      for (const item of value) url.searchParams.append(`${key}[]`, item);
    } else {
      url.searchParams.set(key, String(value));
    }
  }

  const headers = {
    Accept: "application/json",
    platform: PLATFORM_HEADER,
  };

  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetchImpl(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = parsePayload(await response.text());

  if (!response.ok) {
    throw new ClubFeastApiError(
      `ClubFeast API HTTP ${response.status}: ${errorMessage(payload, response.status)}`,
      {
        status: response.status,
        payload,
      },
    );
  }

  return { data: payload, headers: response.headers, status: response.status };
}

export async function listPackagesPage(
  token,
  {
    pageNumber = 0,
    pageSize = 10,
    restaurantId,
    filters = {},
    fetchImpl = globalThis.fetch,
  } = {},
) {
  const response = await request("/v4/restaurant/packages", {
    token,
    fetchImpl,
    query: {
      ...filters,
      restaurant_id: restaurantId,
      page_number: pageNumber,
      page_size: pageSize,
    },
  });
  const page = Array.isArray(response.data)
    ? response.data
    : response.data?.data;

  if (!Array.isArray(page)) {
    throw new ClubFeastApiError(
      "ClubFeast returned an unexpected packages response",
      { status: response.status, payload: response.data },
    );
  }

  return page;
}

export async function listRestaurants(
  token,
  { fetchImpl = globalThis.fetch } = {},
) {
  const response = await request("/v4/restaurant/restaurants/", {
    token,
    fetchImpl,
  });
  const restaurants = Array.isArray(response.data)
    ? response.data
    : response.data?.data;

  if (!Array.isArray(restaurants)) {
    throw new ClubFeastApiError(
      "ClubFeast returned an unexpected restaurants response",
      { status: response.status, payload: response.data },
    );
  }

  return restaurants;
}

export async function listAllPackages(
  token,
  {
    pageSize = 100,
    restaurantId,
    filters = {},
    fetchImpl = globalThis.fetch,
  } = {},
) {
  const packages = [];
  const seenPackageIds = new Set();

  for (let pageNumber = 0; ; pageNumber += 1) {
    const page = await listPackagesPage(token, {
      pageNumber,
      pageSize,
      restaurantId,
      filters,
      fetchImpl,
    });

    let newPackages = 0;
    for (const item of page) {
      const identity = item?.id ?? item?.order_code;
      if (identity !== undefined && seenPackageIds.has(identity)) continue;
      if (identity !== undefined) seenPackageIds.add(identity);
      packages.push(item);
      newPackages += 1;
    }

    if (page.length < pageSize) break;
    if (newPackages === 0) {
      throw new ClubFeastApiError(
        "ClubFeast pagination repeated a page; extraction stopped to avoid a loop",
      );
    }
  }

  return packages;
}

export const clubFeastApiConfig = {
  baseUrl: API_BASE_URL,
  platform: PLATFORM_HEADER,
};
