-- Page view counter.
-- Apply locally:  pnpm wrangler d1 migrations apply DB --local
-- Apply remote:   pnpm wrangler d1 migrations apply DB --remote

CREATE TABLE IF NOT EXISTS views (
  path   TEXT PRIMARY KEY,
  count  INTEGER NOT NULL DEFAULT 0
);
