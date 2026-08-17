---
title: PageLyft SEO Agent - MCP-Powered Monthly SEO Reporting
slug: pagelyft-seo-agent
summary: An automated monthly SEO reporting system built on a custom MCP server. Seventeen typed tools expose Google Search Console, GA4, DataForSEO, and Notion to an AI agent that pulls the data, computes month-over-month deltas, writes a plain-language narrative, and files the report in Notion for human review.
technologies:
  - mcp-servers
  - typescript
  - nodejs
  - seo
  - ga4
  - rest-api
  - docker
completedOn: 2026-07-05T00:00:00.000Z
isActive: true
featured: false
sortOrder: 0
---

Monthly SEO reporting is repetitive work with real stakes: pull the same metrics from four systems, compare them to last month, explain what happened in language a client understands, and file it where they can find it. I built an agentic system that does the whole cycle, with a human review gate before anything reaches a client.

- - -

## The architecture: dumb tools, smart agent

The system is a pnpm monorepo split into two halves with a deliberate boundary between them.

The MCP server (`mcp-seo`) is intentionally dumb. It exposes 17 tools over stdio: Google Search Console performance and top queries, GA4 traffic and channel breakdowns, DataForSEO rank tracking, keyword opportunities, Lighthouse and on-page audits, and Notion reads and writes. It holds every credential, validates every input with Zod, and makes zero judgment calls. Every tool returns the same envelope contract: `{ available, data, source, fetchedAt }` on success, or a structured `unavailable` with a reason. A tool can never crash the server; failures become data.

The agent (`agent-seo-report`) is the smart half. It spawns the MCP server as a child process, reads the client registry from a Notion database, and runs the monthly cycle per client: gather what each client's configuration allows, compute month-over-month deltas against the previous Notion metrics row, generate the narrative with the Anthropic API, and write two purely additive records back, a metrics row and a client-facing report page.

## The defining requirement: never block

Real client data is messy. One client has Search Console linked but no GA4. Another has DataForSEO tracking but stale credentials. The system's core rule is that missing access degrades gracefully instead of stopping the run. Gaps are collected per client and fed into the narrative prompt, so the report says what was unavailable rather than inventing numbers. Missing metrics are written to Notion as blank, never zero. One client failing never aborts the batch, and a re-run is idempotent: if a report already exists for the month, the run skips it instead of duplicating.

## Constrained generation

The narrative model is not allowed to freestyle. The system prompt restricts output to exactly the markdown subset the hand-written markdown-to-Notion-blocks compiler can parse, plain language for a non-expert reader, no speculation, no invented numbers. The generator's grammar is deliberately matched to the parser's.

## Production shape

The whole thing runs as a Railway cron job on the first of every month, posts a run summary to Slack (ok, partial, or failed per client, with gaps listed), and leaves the drafted reports in Notion for me to review before clients see them. TypeScript strict mode throughout, dependency-injected clients, and a Vitest suite colocated with nearly every module so the tools test without touching the network.
