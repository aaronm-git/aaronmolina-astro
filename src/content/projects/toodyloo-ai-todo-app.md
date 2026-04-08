---
title: Toodyloo - AI-Powered To-Do App Built Because Wunderlist Is Gone
slug: toodyloo-ai-todo-app
summary: I built Toodyloo because I missed Wunderlist. It is a full-stack portfolio app with AI-powered task and list creation, optimistic UI, and a production-grade architecture built on TanStack Start, OpenAI, and Neon PostgreSQL.
technologies:
  - react
  - typescript
  - tanstack-start
  - tanstack-router
  - postgresql
  - drizzle-orm
  - better-auth
  - openai
  - sentry
  - netlify
  - shadcn
  - tailwind
  - zod
  - react-query
  - optimistic-ui
  - fullstack
featuredImage: ../../images/project-toodyloo.jpg
liveUrl: https://toodyloo.netlify.app/
repoUrl: https://github.com/aaronm-git/tanstack-start-todo
completedOn: 2025-01-15T00:00:00.000Z
isActive: true
featured: true
sortOrder: -1
---

Wunderlist was the best task app ever made. Microsoft acquired it, shut it down in 2020, and replaced it with Microsoft To Do. Nothing quite filled that gap.

So I built Toodyloo. It is a full-stack portfolio project that combines the clean, focused task management I loved in Wunderlist with real AI features powered by OpenAI. You can describe a goal in plain English and the AI generates an entire list or a set of structured tasks for you. The whole app was built with AI assistance, from architecture planning to production deployment.

- - -

## Why I Built This

I have been a Wunderlist fan since 2013. The app was fast, clear, and never got in the way. When it was shut down, I tried every replacement, and none of them felt right.

Building my own was the obvious next step. It gave me the chance to use a stack I was genuinely excited about, ship a real product I would actually use, and demonstrate full-stack React skills across every layer of the application.

Toodyloo is my portfolio project. It is not a toy. The code is production-grade, the app is deployed on Netlify with server-side rendering, and everything from the database to the UI is fully type-safe.

- - -

## Overview

Toodyloo shows how to build a modern full-stack application with real AI integration baked in from the start, not added as an afterthought.

- **AI-Powered List Creation**: Describe a project or goal and OpenAI generates a complete, structured list for you
- **AI Task Generation**: Create individual tasks from a single plain-English prompt, with priorities and due dates filled in automatically
- **Optimistic UI**: Every action updates the screen instantly before the server responds
- **Type Safety**: Types flow from the Drizzle schema through server functions to React components without any gaps
- **Authentication**: Secure email/password accounts with Better Auth
- **Observability**: Sentry integration for error tracking and performance monitoring
- **Anonymous Mode**: Try the app without signing up first

- - -

### Technical Breakdown

**Tech stack:** TanStack Start, React 19, TypeScript, PostgreSQL, Drizzle ORM, Better Auth, OpenAI, Sentry, shadcn/ui, Tailwind CSS v4, Zod, TanStack Query, Netlify.

- Built the full-stack application with **TanStack Start** for server-side rendering and type-safe server functions
- Used **TanStack Router** for file-based, fully type-safe routing
- Connected to a **Neon PostgreSQL** database using **Drizzle ORM** for type-safe queries and migrations
- Implemented **Better Auth** for email/password authentication with anonymous session support
- Integrated **OpenAI** in the backend so users can generate lists and tasks from plain-English prompts
- Instrumented server functions with **Sentry** spans for error tracking and performance monitoring
- Built UI components with **shadcn/ui** and **Radix UI** for accessible, consistent design
- Styled with **Tailwind CSS v4** for responsive, modern layouts
- Used **Zod** for runtime validation that doubles as the source of truth for TypeScript types
- Managed server state with **TanStack Query** including optimistic mutations and automatic cache invalidation
- Deployed on **Netlify** with SSR and serverless functions via the official TanStack Start adapter

- - -

## Key Features

- **AI List Generation**: Tell the AI what you are working on and it builds a complete, organized list
- **AI Task Creation**: Describe a task in plain English and the AI extracts the title, priority, and due date automatically
- **AI Subtask Breakdown**: The AI reads a task and suggests logical subtasks, turning big goals into manageable steps
- **Smart Task Management**: Organize tasks into lists with color-coded categories and subtask hierarchies
- **Optimistic Updates**: Instant UI feedback with automatic rollback on errors
- **Activity Log**: Real-time progress indicators and a full history of all operations
- **Advanced Filtering**: Filter by status, priority, due date, and category
- **Responsive Design**: Works on desktop and mobile
- **Dark Mode**: System-aware theme switching
- **Anonymous Mode**: Use the app locally without an account, then sign up to save your data

- - -

## Technical Highlights

### Type-Safe Architecture

Types start at the Drizzle schema, flow through Zod-validated server functions, and land in React components without a single `any`. A schema change produces TypeScript errors across the entire codebase instantly, which catches bugs at compile time instead of in production.

### Optimistic UI Pattern

Every mutation updates the UI before the server responds. If the request fails, the change rolls back automatically with a user-friendly error message. A global activity drawer shows a live log of all pending and completed operations. This pattern makes the app feel as fast as a native application.

### AI Integration with OpenAI

The AI features connect to OpenAI's API in a TanStack Start server function. The user's prompt is sent to `gpt-4o-mini`, the response is parsed and validated with Zod, and the results are saved directly to the user's account. Fast, structured, and type-safe from prompt to database.

### Production Observability

Every server function is wrapped in a `Sentry.startSpan()` call. This gives structured traces for every database query and AI call, which makes debugging and performance tuning straightforward.

- - -

## Why I Chose TanStack Start Over Next.js

I have built a lot of production React, and I have strong opinions about frameworks. I want clarity, type-safety, and control. Next.js App Router is powerful, but the modern model asks you to internalize a lot of implicit behavior around caching, where code runs, and how Server Components interact with Client Components. I got tired of fighting it.

Here is why I chose TanStack Start for this project:

**1. No RSC mental gymnastics as the default**
I do not want to constantly ask "server component or client component?" TanStack Start keeps boundaries explicit and easy to reason about.

**2. Server Functions are the right abstraction**
I want backend logic colocated with my app, but explicit and easy to test. TanStack Start's `createServerFn` is a clean abstraction for full-stack work without turning every mutation into framework ceremony.

**3. Type-safe routing is not optional**
TanStack Router makes route params and navigation fail at compile time instead of in production. Stringly-typed routes make refactoring scary.

**4. The data layer is predictable**
TanStack Query's primitives for caching, invalidation, optimistic updates, and retries fit TanStack Start's mental model cleanly. App behavior stays consistent and debugging is straightforward.

**5. Platform portability**
I deploy where it makes sense. This app runs on Netlify with SSR and server functions via the official framework adapter.

Next.js still has its place. But for this project, I wanted a system that stays understandable as it grows.

- - -

## Obstacles and Solutions

### Obstacle: Optimistic UI with Error Handling

Users expect instant feedback, but network requests can fail. Building optimistic updates that handle errors gracefully required a system that could track every pending operation and recover cleanly.

### Solution

I built a global optimistic operations provider that:

- Tracks all pending operations with unique IDs
- Shows real-time progress indicators in a drawer
- Automatically rolls back failed operations with user-friendly error messages
- Logs all operations to an activity history

TanStack Query mutations with `onMutate` callbacks handle the client-side state. Sentry captures any failures for later review.

- - -

### Obstacle: End-to-End Type Safety

Maintaining types from the database schema through server functions to the UI is important but requires discipline, especially when queries are dynamic.

### Solution

The type flow works like this: Drizzle schema defines the tables, `createSelectSchema()` turns those into Zod schemas, `z.infer<>` produces the TypeScript types, and those types are used everywhere. A change in the database schema automatically produces type errors in server functions and UI components. Bugs surface at compile time.

- - -

### Obstacle: AI Integration with Privacy in Mind

Adding AI features while being clear about data handling required careful UX decisions and server-side guardrails.

### Solution

I added clear privacy notices in the AI dialog explaining that prompts are sent to OpenAI. Users see links to the Privacy Policy and Terms of Service before using AI features. On the server side, prompts are never logged beyond what Sentry needs for error tracing, and AI calls run through validated server functions so no raw input reaches the database.

- - -

### Author

Aaron Molina - Senior Frontend Developer

[Contact Me](https://aaronmolina.me/contact)

- - -

## Credits

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Better Auth](https://www.better-auth.com/)
- [OpenAI](https://openai.com/)
- [Sentry](https://sentry.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zod](https://zod.dev/)
- [Netlify](https://www.netlify.com/)
