/**
 * Public stats API for the Muchi portfolio case study.
 * Keeps the PostHog personal API key server-side and returns meal + WAU stats.
 *
 * Secrets (set with `npx wrangler secret put POSTHOG_API_KEY`):
 *   POSTHOG_API_KEY — PostHog personal API key with query:read
 */

type WorkerEnv = Cloudflare.Env & {
  POSTHOG_API_KEY: string;
};

const ALLOWED_ORIGINS = new Set([
  "https://www.sharirobertshaw.com",
  "https://sharirobertshaw.com",
  "http://127.0.0.1:8899",
  "http://localhost:8899",
  "http://127.0.0.1:8765",
  "http://localhost:8765",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
]);

type PostHogQueryResponse = {
  results?: unknown[][];
  error?: string;
};

type MuchiStats = {
  mealsLogged: number;
  weeklyActiveUsers: number;
};

function corsHeaders(origin: string | null): HeadersInit {
  const allowed =
    origin && (ALLOWED_ORIGINS.has(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))
      ? origin
      : "https://www.sharirobertshaw.com";

  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function jsonResponse(
  body: unknown,
  status: number,
  origin: string | null,
  extraHeaders: HeadersInit = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(origin),
      ...extraHeaders,
    },
  });
}

async function fetchMuchiStats(env: WorkerEnv): Promise<MuchiStats> {
  const url = `${env.POSTHOG_HOST}/api/projects/${env.POSTHOG_PROJECT_ID}/query/`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.POSTHOG_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "portfolio-muchi-stats",
      query: {
        kind: "HogQLQuery",
        query: `
          SELECT
            countIf(event = 'meal_logged') AS meals_logged,
            count(DISTINCT if(
              timestamp >= now() - INTERVAL 7 DAY
              AND event IN (
                'meal_logged',
                'screen_viewed',
                'surface_opened',
                'Application opened',
                'Application became active'
              ),
              person_id,
              NULL
            )) AS weekly_active_users
          FROM events
        `,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`PostHog query failed (${response.status}): ${detail.slice(0, 300)}`);
  }

  const data = (await response.json()) as PostHogQueryResponse;

  if (data.error) {
    throw new Error(data.error);
  }

  const mealsLogged = Number(data.results?.[0]?.[0]);
  const weeklyActiveUsers = Number(data.results?.[0]?.[1]);

  if (!Number.isFinite(mealsLogged) || !Number.isFinite(weeklyActiveUsers)) {
    throw new Error("Unexpected PostHog response shape");
  }

  return { mealsLogged, weeklyActiveUsers };
}

export default {
  async fetch(request: Request, env: WorkerEnv, ctx: ExecutionContext): Promise<Response> {
    const origin = request.headers.get("Origin");
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "GET") {
      return jsonResponse({ error: "Method not allowed" }, 405, origin);
    }

    if (url.pathname !== "/" && url.pathname !== "/meals") {
      return jsonResponse({ error: "Not found" }, 404, origin);
    }

    if (!env.POSTHOG_API_KEY) {
      return jsonResponse(
        { error: "POSTHOG_API_KEY secret is not configured" },
        500,
        origin,
      );
    }

    const ttlSeconds = Math.max(60, Number(env.CACHE_TTL_SECONDS) || 3600);
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), { method: "GET" });

    const cached = await cache.match(cacheKey);
    if (cached) {
      const headers = new Headers(cached.headers);
      Object.entries(corsHeaders(origin)).forEach(([key, value]) => {
        headers.set(key, value);
      });
      return new Response(cached.body, { status: cached.status, headers });
    }

    try {
      const stats = await fetchMuchiStats(env);
      const payload = {
        ...stats,
        updatedAt: new Date().toISOString(),
      };

      const response = jsonResponse(payload, 200, origin, {
        "Cache-Control": `public, max-age=${ttlSeconds}`,
      });

      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(JSON.stringify({ level: "error", message }));
      return jsonResponse({ error: "Failed to fetch Muchi stats" }, 502, origin);
    }
  },
} satisfies ExportedHandler<WorkerEnv>;
