/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  DB: D1Database;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ✅ API 1: HELLO
    if (url.pathname === "/api/hello") {
      return Response.json(
        { ok: true, msg: "Hello API" },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // ✅ API 2: D1 query
    if (url.pathname === "/api/notes") {
      const { results } = await env.DB.prepare("SELECT * FROM notes").all();
      return Response.json(results);
    }

    if (url.pathname === "/api/config") {
      return Response.json({
        greeting: env.GREETING,
        hasKey: !!env.API_KEY,
      });
    }

    // ✅ Serve frontend assets
    return env.ASSETS.fetch(request);
  },
};