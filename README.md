<img src="public/banner/banner-poster.png" alt="" width="100%" />

<h1 align="center">ayush64.me</h1>

<p align="center">
  My corner of the internet. Dark, calm, a few hand-drawn chalk marks.
</p>

<p align="center">
  <code>Astro</code> <code>Tailwind</code> <code>Cloudflare Workers</code> <code>D1</code>
</p>

<br/>

### ⌁ run

```bash
pnpm install
pnpm dev         # localhost:4321
pnpm build       # → dist/
pnpm typecheck   # wrangler types + astro check
```

<sub>Node 22+ · pnpm 10</sub>

### ⌁ edit

| What | Where |
|---|---|
| Projects & diagrams | `src/data/projects.ts` |
| Blog posts | `src/content/blog/*.md` (copy `_template.md`; `draft: true` hides it) |
| Worth reading | `src/data/reading.ts` |
| Bio & links | `src/components/Intro.astro` |
| Timeline | `src/components/Timeline.astro` |
| Colours, fonts, motion | `src/styles/global.css` |
| Resume | `public/ayush_sharma_resume.pdf` |

### ⌁ deploy

```bash
pnpm wrangler d1 create portfolio              # id → wrangler.jsonc
pnpm wrangler d1 migrations apply DB --remote
pnpm build && pnpm wrangler deploy
```

<sub>Pages are prerendered; only <code>/api/views</code> runs at the edge. For local dev, run <code>wrangler d1 migrations apply DB --local</code> once.</sub>

### ⌁ images

- **Share card**: `pnpm og` renders `public/og.png` (needs Chromium; set `CHROMIUM_PATH` if needed)
- **Banner**: `python3 -I scripts/banner.py public/banner/banner-poster.png`

<br/>

<p align="center"><sub>built by <a href="https://github.com/allesko64">ayush</a></sub></p>
