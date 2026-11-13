/**
 * Small helpers shared by the on-demand API routes.
 * Runs on the edge (Cloudflare Workers), never in the browser.
 */
import { env } from 'cloudflare:workers';

export function db(): D1Database {
  return env.DB;
}

export function json(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json; charset=utf-8');
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function error(status: number, message: string): Response {
  return json({ error: message }, { status });
}
