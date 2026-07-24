---
title: PoolPuma - Pool Service Management Software for Route-Based Pool Companies
slug: poolpuma
summary: A full-stack pool service management platform I built from scratch. One Bun and Hono API powers a React web app, a native SwiftUI macOS client, and an Expo iPhone app, with route planning, field proof photos, Stripe billing, and AI-assisted route ordering.
technologies:
  - bun
  - hono
  - typescript
  - postgresql
  - drizzle-orm
  - better-auth
  - react
  - react-native
  - expo
  - swift
  - stripe
  - openai
  - aws
  - docker
  - railway
  - netlify
  - zod
  - tailwindcss
  - fullstack
featuredImage: ../../images/project-poolpuma.png
liveUrl: https://poolpuma.com
completedOn: 2026-07-01T00:00:00.000Z
isActive: true
featured: true
sortOrder: -4
---

PoolPuma is pool service management software I designed and built end to end. It gives pool companies one place to manage clients, pools, routes, and schedules, then hands their field techs a stripped-down mobile app to run those routes and log every visit with proof photos.

The interesting part for me was the shape of the system. It is one API serving three very different clients: a React web app for owners and managers, a native SwiftUI macOS app, and an Expo iPhone app for the techs in the field. The contracts and validation live in shared packages, so every client speaks the same language.

- - -

## Why I Built This

Pool service is a route business. A company has a list of pools, a handful of techs, and a week to get everyone serviced. Most of the tools for that are either ancient desktop software or generic field-service apps that were never built for the specifics of pool work, like water chemistry readings and before-and-after proof photos.

I wanted to build the version that felt right: fast for the owner planning the week, and dead simple for the tech standing at a pool with one hand full. That meant a real backend, real auth, real billing, and a mobile client that works, not a prototype.

It also gave me a reason to build on a stack I had been wanting to ship in production: Bun and Hono for the API, with a strict TypeScript contract flowing all the way out to a native Swift client.

- - -

## Overview

PoolPuma covers the full loop of a pool service operation, from onboarding a company to a tech closing out a visit in the field.

- **Company and client management**: Owners set up their company, staff, clients, and pools in one place
- **Route planning and scheduling**: Build recurring routes and schedules, then assign them to techs
- **Field service app**: Techs see only their assigned routes and log visits without client or billing details
- **Proof photos**: Every service visit captures before-and-after photos stored in S3-compatible object storage
- **Water chemistry and AI recommendations**: Optional AI route ordering and chemical dosing suggestions
- **Role-based access**: Owner, manager, and pool operator roles with different views and permissions
- **Subscription billing**: Stripe Hosted Checkout and Customer Portal across Solo, Team, and Growth plans
- **Transactional email**: Verify, welcome, password reset, and emailed customer service reports

- - -

### Technical Breakdown

**Tech stack:** Bun, Hono, TypeScript, PostgreSQL, Drizzle ORM, Better Auth, React, SwiftUI, Expo React Native, Stripe, OpenAI, Resend, S3-compatible storage, Docker, Railway, Netlify, Zod, Turborepo.

- Built the API on **Bun** with **Hono** as the HTTP framework and `@hono/zod-validator` for request validation
- Modeled the database in **PostgreSQL** with **Drizzle ORM** for type-safe schema and migrations
- Handled auth with **Better Auth** and its Drizzle adapter, owning sessions, rate limiting, and IP handling behind a trusted proxy
- Shared roles, DTOs, and API contracts through a **`packages/shared`** workspace so every client validates against the same source of truth
- Built the owner and manager web app with **React** on **Vite**
- Built a native **SwiftUI** macOS client for phase one, compiled with SwiftPM
- Built the field techs' iPhone app with **Expo** and **React Native**
- Integrated **Stripe** for subscriptions with webhook handling for the full checkout and subscription lifecycle
- Added optional **OpenAI** route ordering and chemical recommendations that fall back safely when the key is absent
- Stored service-visit proof photos in **S3-compatible object storage**, using **MinIO** in Docker for local development
- Sent transactional and customer-report email through **Resend**
- Ran the whole thing as a **Turborepo** monorepo and deployed the API on **Railway** with the marketing and web frontends on **Netlify**

- - -

## Key Features

- **One API, three clients**: A single Bun and Hono backend serves the web app, the macOS app, and the iPhone app from shared contracts
- **Route runs for the field**: Techs pull their assigned route, work it pool by pool, and log each visit as they go
- **Proof-photo pipeline**: Photos upload straight to object storage under the account's prefix, with per-visit size limits
- **AI route ordering**: Optional OpenAI ordering suggests an efficient run of a day's stops
- **Chemical recommendations**: Optional AI dosing suggestions from logged water chemistry readings
- **Customer service reports**: Owners can email clients a service report, with proof photos attached
- **Stripe plan management**: Self-serve upgrades and downgrades across Solo, Team, and Growth via the Customer Portal
- **Operator redaction**: Field techs never see client contact or billing details, enforced at the API layer

- - -

## Technical Highlights

### One API, Three Clients

The system is one Hono API with three consumers that could not be more different: a React web app, a native SwiftUI macOS app, and an Expo iPhone app. To keep them honest, roles, DTO validation, and API contracts live in a shared workspace package. A change to a contract ripples out to every client instead of drifting per platform.

### Bun and Hono in Production

I built the API on Bun with Hono because I wanted a fast runtime and a small, explicit HTTP layer without the middleware sprawl. Hono's typed context and `zod-validator` gave me request validation that matches the shared contracts, and Bun handled the test suite and TypeScript execution directly. I wrote about the reasoning in more detail on the [blog](/blog/why-bun-hono-over-node).

### Role-Enforced Data at the API

Pool operators are trusted to log work, not to see billing. Rather than hide fields in the UI, the API redacts client contact and billing data for the operator role before it ever leaves the server. There is a dedicated test suite pinning that redaction so a future change cannot quietly leak it.

### Field-First Storage and Email

Proof photos are part of the MVP, not a nice-to-have, so the API readiness check fails if object storage is unreachable. Uploads land under the account's prefix with enforced size limits. Customer reports are assembled server-side and sent through Resend, with proof-photo attachments capped to stay under provider limits.

- - -

## Obstacles and Solutions

### Obstacle: Keeping Three Clients in Sync

A web app, a native Swift app, and a React Native app can drift apart fast. Each platform wants to shape data its own way, and small mismatches become field bugs.

### Solution

I moved roles, DTO validation, and the API contracts into a shared package that the API and the TypeScript clients import directly. The Swift client mirrors the same contract shape. There is one definition of what a route or a visit looks like, so the clients stay aligned instead of negotiating.

### Obstacle: Field Techs Should Not See Everything

The same route data that an owner reviews includes client contact details and billing context that a field tech has no business seeing.

### Solution

I built role-based redaction into the API itself. For the pool operator role, the server strips client contact and billing fields before responding, and a dedicated test suite locks that behavior down so a refactor cannot regress it.

### Obstacle: Making AI Optional, Not Load-Bearing

AI route ordering and chemical recommendations are useful, but the app cannot fall over when the AI key is missing or the API is having a bad day.

### Solution

Every AI path has a safe fallback. Route ordering degrades to a sensible default order, and chemical recommendations simply do not appear rather than blocking a visit. The OpenAI key is optional in every environment, so the core service loop never depends on it.

- - -

### Author

Aaron Molina - Senior Frontend Developer

[Contact Me](https://aaronmolina.me/contact)

- - -

## Credits

- [Bun](https://bun.sh/)
- [Hono](https://hono.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Better Auth](https://www.better-auth.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Stripe](https://stripe.com/)
- [OpenAI](https://openai.com/)
- [Expo](https://expo.dev/)
- [Resend](https://resend.com/)
- [Railway](https://railway.app/)
- [Netlify](https://www.netlify.com/)
