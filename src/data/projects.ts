/**
 * Single source of truth for the projects shown on the site.
 * Claims mirror public/ayush_sharma_resume.pdf — keep the two in sync.
 */
import type { ImageMetadata } from 'astro';
import alfredPreview from '../assets/previews/alfred.jpg';
import gitlingoPreview from '../assets/previews/gitlingo.jpg';
import dossierPreview from '../assets/previews/dossier.jpg';
import type { DiagramData } from '../components/Diagram.astro';

export interface Project {
  slug: string;
  name: string;
  /** One line, used on the landing page. */
  oneLiner: string;
  /** Short subtitle under the title on /projects. */
  kind: string;
  built: string[];
  stack: string[];
  live: string;
  repo: string;
  /** Screenshot of the live site, shown on link hover. */
  preview: ImageMetadata;
  /** How it fits together; drawn by Diagram.astro. Accent = the main path. */
  diagram: DiagramData;
}

export const projects: Project[] = [
  {
    slug: 'alfred',
    name: 'ALFRED',
    kind: 'AI software delivery platform',
    oneLiner:
      'Turns a feature request into a spec and task board, then AI-reviews the pull request against that spec.',
    built: [
      '15-state feature lifecycle enforced by Postgres, so invalid states can’t exist.',
      'Race-safe credits and shipping: guards live in the UPDATE, not a pre-read.',
      'Code review grounded in the repo via vector search, within a fixed prompt budget.',
    ],
    stack: ['Next.js', 'tRPC', 'PostgreSQL', 'pgvector', 'Redis'],
    live: 'https://alfred.ayushlabs.tech',
    repo: 'https://github.com/allesko64/alfred',
    preview: alfredPreview,
    diagram: {
      title: 'A feature moving through ALFRED, from request to AI review',
      stages: [
        [{ id: 'req', label: 'Request', note: 'a feature request comes in; an agent flags duplicates and asks about gaps.' }],
        [{ id: 'spec', label: 'Spec (PRD)', note: 'an AI-written PRD becomes the source of truth for the feature.' }],
        [{ id: 'tasks', label: 'Task board', note: 'the spec is broken into tasks on a Kanban board.' }],
        [{ id: 'pr', label: 'Pull request', note: 'PRs come in from GitHub and are linked to the feature.' }],
        [{ id: 'review', label: 'AI review', accent: true, note: 'the PR is reviewed against the spec, grounded in the repo via vector search; a human approves.' }],
      ],
      edges: [
        { from: 'req', to: 'spec' },
        { from: 'spec', to: 'tasks' },
        { from: 'tasks', to: 'pr' },
        { from: 'pr', to: 'review', accent: true },
      ],
    },
  },
  {
    slug: 'gitlingo',
    name: 'Git Lingo',
    kind: 'Interactive git learning platform',
    oneLiner:
      'Learn git by typing real commands in the browser and watching files move. Custom git engine, 14 levels, 100+ learners.',
    built: [
      'Own git engine in TypeScript: one pure function per command, fully deterministic.',
      '14 levels across 3 chapters, with hints instead of penalties.',
      'Terminal built from scratch in React, with a key bar that works on phones.',
    ],
    stack: ['Next.js', 'TypeScript', 'Postgres', 'Playwright'],
    live: 'https://gitlingo.ayushlabs.tech',
    repo: 'https://github.com/allesko64/gitlingo',
    preview: gitlingoPreview,
    diagram: {
      title: 'How a git command moves files between the four zones in Git Lingo',
      stages: [
        [{ id: 'cmd', label: '$ git add .', note: 'you type a real git command into a terminal built from scratch in React.' }],
        [{ id: 'engine', label: 'Git engine', accent: true, note: 'one pure TypeScript function per command computes the next state; no real git, fully deterministic.' }],
        [
          { id: 'work', label: 'Working', note: 'files you have changed.' },
          { id: 'stage', label: 'Staging', accent: true, note: 'what the next commit will contain; `git add` moves files here.' },
          { id: 'local', label: 'Local', note: 'commits on your machine.' },
          { id: 'remote', label: 'Remote', note: 'what has been pushed.' },
        ],
      ],
      edges: [
        { from: 'cmd', to: 'engine', accent: true },
        { from: 'engine', to: 'work' },
        { from: 'engine', to: 'local' },
        { from: 'engine', to: 'remote' },
        { from: 'engine', to: 'stage', accent: true },
      ],
    },
  },
  {
    slug: 'dossier',
    name: 'Dossier',
    kind: 'Form builder and data collection platform',
    oneLiner: 'Build a custom form, collect responses from the public, and export the data as CSV.',
    built: [
      'One schema engine handles any form shape, validated at the API.',
      'Safe under concurrent load: rate limits, idempotent writes, ACID transactions.',
      'Self-hosted on my own Linux server with Nginx and TLS.',
    ],
    stack: ['Next.js', 'Express', 'PostgreSQL', 'Nginx'],
    live: 'https://dossier.ayushlabs.tech',
    repo: 'https://github.com/allesko64/form-builder-saas',
    preview: dossierPreview,
    diagram: {
      title: 'A public form submission travelling through Dossier',
      stages: [
        [{ id: 'browser', label: 'Browser', note: 'a visitor opens a public form and submits it.' }],
        [{ id: 'nginx', label: 'Nginx · TLS', note: 'terminates TLS and routes traffic on my own Linux server.' }],
        [
          { id: 'web', label: 'Next.js', note: 'renders the form builder and the public forms.' },
          { id: 'api', label: 'Express + tRPC', accent: true, note: 'validates every submission against the form’s schema at the API boundary.' },
        ],
        [
          { id: 'pg', label: 'PostgreSQL', accent: true, note: 'responses stored in ACID transactions with idempotent writes.' },
          { id: 'valkey', label: 'Valkey', note: 'rate limits, public-form cache and live analytics.' },
        ],
      ],
      edges: [
        { from: 'nginx', to: 'web' },
        { from: 'api', to: 'valkey' },
        { from: 'browser', to: 'nginx', accent: true },
        { from: 'nginx', to: 'api', accent: true },
        { from: 'api', to: 'pg', accent: true },
      ],
    },
  },
];

export const featured = projects.filter((p) => p.slug === 'alfred' || p.slug === 'gitlingo');
