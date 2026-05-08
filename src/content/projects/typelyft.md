---
title: TypeLyft - Responsive Type Scale Builder for Design Teams
slug: typelyft
summary: A paid typography system app that helps teams define a responsive type scale, preview hierarchy in realistic layouts, and export implementation-ready tokens. Built with Next.js 16, better-auth, Drizzle on Neon Postgres, and Lemon Squeezy subscriptions.
technologies:
  - nextjs
  - react
  - typescript
  - tailwindcss
  - shadcn
  - postgresql
  - neon
  - drizzle-orm
  - better-auth
  - lemon-squeezy
  - resend
  - netlify
  - zod
  - fullstack
featuredImage: ../../images/project-typelyft.png
liveUrl: https://typelyft.pagelyft.com/
completedOn: 2026-05-08T00:00:00.000Z
isActive: true
featured: true
sortOrder: -3
---

TypeLyft is a paid typography system app I built under Pagelyft Studio. It helps product and design teams define a responsive type scale, preview hierarchy in realistic layouts, and export implementation-ready typography tokens without redoing the same ratio and clamp math on every project.

- - -

## Why I Built This

Every design system project I touched ended the same way. Someone hand-tunes a base size, picks a ratio, eyeballs the clamp values, and ships a Figma file the engineers then translate into CSS variables. Two months later a marketing page needs a slightly different scale and the entire process restarts.

TypeLyft turns that into a single source of truth. You set the base size, ratio, and viewport range once, watch the scale apply to a real preview, and export tokens the team can drop straight into Tailwind, CSS, or design tools. The math stays consistent across pages, breakpoints, and brand surfaces.

It is also the first product to ship under Pagelyft Studio. I wanted a focused SaaS that proved out the full stack I plan to reuse: Next.js 16 App Router, better-auth with magic links, Drizzle on Neon, Lemon Squeezy subscriptions, and Netlify hosting.

- - -

## Overview

TypeLyft is a full-stack web app focused on one job: making typography systems repeatable.

- **Scale builder**: Tune base size, ratio, and viewport range and watch the whole scale recompute live
- **Hierarchy preview**: Inspect display, h1 through h6, and body styles before committing
- **Browser preview**: See the scale render inside a realistic landing page and blog post layout
- **Token export**: Generate clamp-ready CSS, Tailwind, and design tokens
- **Review links**: Share read-only review links with stakeholders without giving them an editor seat
- **Premium gating**: Free tier covers the basics, premium unlocks inline token editing, font pairing, and the full Google Fonts library
- **Magic link auth**: Sign in with a link instead of remembering yet another password

- - -

### Technical Breakdown

**Tech stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, better-auth, Neon Postgres, Drizzle ORM, Lemon Squeezy, Resend, Netlify, shadcn/ui on Base UI, Zod.

- Built the full-stack app with **Next.js 16** App Router and Server Actions for type-safe mutations
- Used **better-auth** for magic-link sign-in tied to subscription state
- Modeled the schema with **Drizzle ORM** on **Neon Postgres** so types flow from database to UI without gaps
- Sent magic links and account emails through **Resend** with a verified production sender
- Wired billing through **Lemon Squeezy** with a deduped webhook that upserts subscription state
- Hosted on **Netlify** with Netlify Forms handling the contact surface
- Built the UI with **shadcn/ui** primitives on **Base UI** and **Tailwind CSS v4**
- Validated every input with **Zod** at the server boundary

- - -

## Key Features

- **Live scale preview**: Adjust base size, ratio, and viewport min and max and the entire hierarchy updates in place
- **Realistic browser preview**: Switch between landing page and blog post mocks to see how the scale behaves in context
- **Token export**: Copy clamp-ready CSS or Tailwind config the moment a scale feels right
- **Review links**: Public review URLs at `/review/[slug]` let stakeholders comment on a scale without an account
- **Premium typography library**: Free draft uses a starter font set, premium unlocks the full Google Fonts library and separate heading and body pairings
- **Magic link auth**: One-click sign-in with a link, no password required
- **Subscription-aware gating**: Active and on-trial subscriptions unlock premium, cancelled subscriptions retain access until the period ends, paused or past-due states do not

- - -

## Technical Highlights

### Subscription-Aware Premium Gating

Premium features are gated by subscription status, not by a static plan flag. Active and on-trial subscriptions unlock everything. Cancelled subscriptions keep premium access until the period ends. Paused, past-due, unpaid, and expired states all lock the premium surface immediately. The gate reads from a single helper that the UI, the server actions, and the export endpoints all share, so the rule never drifts between layers.

### Lemon Squeezy Webhook Pipeline

The webhook endpoint at `/api/webhooks/lemonsqueezy` is the source of truth for subscription state. Payloads are deduplicated by event ID before they touch the database, so a retry from Lemon Squeezy never double-applies a state change. The handler then upserts into the `subscriptions` table keyed by the better-auth user ID, which keeps the auth identity and the billing identity in lockstep.

### Responsive Scale Math

The scale builder turns a base size, ratio, and viewport range into a clamp expression for every step in the hierarchy. The math runs the same on the server and the client, so server-rendered pages match the live preview the moment hydration finishes.

- - -

## Obstacles and Solutions

### Obstacle: Keeping Premium Logic Honest Across Layers

Early on, premium checks lived in three places: the UI hid premium controls, the server actions rejected premium payloads, and the export endpoints filtered premium tokens. The three drifted within a week.

### Solution

I collapsed the rule into one helper that takes a subscription row and returns a typed access object. The UI, server actions, and export endpoints now import that helper and never compute access on their own. Adding a new gated feature means extending the helper once instead of editing three call sites.

- - -

### Obstacle: Webhook Replays Doubling Subscription State

Lemon Squeezy retries webhooks aggressively. Without dedup, an `active` event could land twice and overwrite a more recent `cancelled` event already on file.

### Solution

I added an event ID dedup table that records every webhook ID before processing. If the ID has been seen, the handler returns 200 without touching the subscriptions table. This makes retries safe without losing the at-least-once guarantee Lemon Squeezy depends on.

- - -

### Obstacle: Magic Links That Worked Locally But Not in Production

The dev fallback to Resend's shared sender hid a misconfigured production domain for a week. Production magic links failed silently because the verified domain was not yet active.

### Solution

I disabled the dev fallback in production builds and added a startup check that fails fast if the production app boots without a verified Resend sender. The error surfaces in deploy logs instead of dead emails in user inboxes.

- - -

### Author

Aaron Molina - Senior Frontend Developer

[Contact Me](https://aaronmolina.me/contact)

- - -

## Credits

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [better-auth](https://www.better-auth.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Neon](https://neon.tech/)
- [Lemon Squeezy](https://www.lemonsqueezy.com/)
- [Resend](https://resend.com/)
- [Netlify](https://www.netlify.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Base UI](https://base-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zod](https://zod.dev/)
