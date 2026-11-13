import type { APIRoute } from 'astro';
import { db, error, json } from '../../lib/server';

export const prerender = false;

const ALLOWED = new Set(['/', '/projects', '/blog']);

function normalize(p: unknown): string | null {
  if (typeof p !== 'string') return null;
  const path = p.replace(/\/+$/, '') || '/';
  return ALLOWED.has(path) ? path : null;
}

/** Current count. */
export const GET: APIRoute = async (ctx) => {
  const path = normalize(ctx.url.searchParams.get('path') ?? '/');
  if (!path) return error(400, 'Unknown path.');
  const row = await db()
    .prepare(`SELECT count FROM views WHERE path = ?1`)
    .bind(path)
    .first<{ count: number }>();
  return json({ path, count: row?.count ?? 0 }, { headers: { 'cache-control': 'no-store' } });
};

/** Increment and return the new count. */
export const POST: APIRoute = async (ctx) => {
  let path: string | null = null;
  try {
    const body = (await ctx.request.json()) as { path?: unknown };
    path = normalize(body.path);
  } catch {
    /* fall through */
  }
  if (!path) return error(400, 'Unknown path.');

  const row = await db()
    .prepare(
      `INSERT INTO views (path, count) VALUES (?1, 1)
       ON CONFLICT(path) DO UPDATE SET count = count + 1
       RETURNING count`,
    )
    .bind(path)
    .first<{ count: number }>();

  return json({ path, count: row?.count ?? 1 }, { headers: { 'cache-control': 'no-store' } });
};
