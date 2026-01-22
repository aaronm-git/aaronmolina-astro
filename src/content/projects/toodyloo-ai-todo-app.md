---
title: Toodyloo - AI-Powered Smart To-Do App
slug: toodyloo-ai-todo-app
summary: A modern, full-stack smart to-do app built with TanStack Start, featuring AI-powered task creation, optimistic UI updates, and production-grade architecture.
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

Toodyloo is a production-quality smart to-do application that showcases modern full-stack development practices. Built with **TanStack Start**, it features AI-powered task creation, optimistic UI updates, comprehensive error handling, and a complete authentication system.

- - -

## Overview

This application demonstrates how to build a "real" production application with enterprise-level features including:

- **AI Integration**: Natural language task creation using OpenAI
- **Optimistic UI**: Instant feedback with automatic rollback on errors
- **Type Safety**: End-to-end TypeScript from database to UI
- **Authentication**: Secure email/password auth with Better Auth
- **Observability**: Sentry integration for error tracking and performance monitoring
- **Modern Stack**: TanStack Start, React Query, Drizzle ORM, and more

- - -

### 🛠️ Technical Breakdown

**Tech stack:**
I built Toodyloo using **TanStack Start**, **React**, **TypeScript**, **PostgreSQL**, **Drizzle ORM**, **Better Auth**, **OpenAI**, **Sentry**, **Shadcn UI**, **Tailwind CSS**, **Zod**, **React Query**, **Netlify**, and **Git**.

- Built the full-stack application with **TanStack Start** for server-side rendering and API routes
- Used **TanStack Router** for type-safe routing with file-based routing
- Integrated **PostgreSQL** database with **Drizzle ORM** for type-safe database queries
- Implemented **Better Auth** for secure authentication with email/password
- Added **OpenAI integration** for AI-powered natural language task creation
- Used **Sentry** for error tracking and performance instrumentation
- Built UI components with **Shadcn UI** and **Radix UI** for accessibility
- Styled with **Tailwind CSS** for responsive, modern design
- Implemented **Zod** validation for type-safe data validation
- Used **React Query** for server state management and caching
- Implemented **optimistic UI updates** with automatic error handling and rollback
- Deployed on **Netlify** with serverless functions
- Used **Git** for version control

## Key Features

- **AI-Powered Task Creation**: Describe tasks in natural language and AI extracts details, priorities, and due dates
- **Smart Task Management**: Organize tasks into lists/categories with subtasks
- **Optimistic Updates**: Instant UI feedback with automatic error recovery
- **Activity Log**: Track all operations with real-time progress indicators
- **Advanced Filtering**: Filter by status, priority, due date, and category
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: System-aware theme switching
- **Type Safety**: Full TypeScript coverage from database to UI
- **Error Handling**: Comprehensive error tracking with Sentry
- **Authentication**: Secure user accounts with password reset functionality

## Technical Highlights

### Type-Safe Architecture
- **Database to UI**: Types flow from Drizzle schema through server functions to React components
- **Zod Validation**: All user inputs validated before database writes
- **TypeScript First**: Zero `any` types, full type coverage

### Optimistic UI Pattern
- **Instant Feedback**: UI updates immediately on user actions
- **Automatic Rollback**: Failed operations automatically revert with error messages
- **Activity Tracking**: Real-time progress bar and activity log for all operations
- **Error Recovery**: User-friendly error messages with retry capabilities

### AI Integration
- **Natural Language Processing**: Convert plain English descriptions into structured tasks
- **Smart Parsing**: Extracts priorities, due dates, and task details automatically
- **Privacy-First**: Clear warnings about not sharing sensitive information

### Production Features
- **Error Monitoring**: Sentry integration for automatic error tracking
- **Performance Instrumentation**: Server function instrumentation for observability
- **Database Migrations**: Drizzle migrations for schema management
- **Environment Configuration**: Support for multiple deployment environments

## Why I switched to TanStack Start (vs Next.js App Router)

I’ve built a lot of production React, and I’m pretty opinionated about frameworks: I want **clarity**, **type-safety**, and **control**—not “magic” that’s impressive until it’s 2am and you’re debugging a cache/SSR/RSC edge case. Next.js App Router is powerful, but the modern model asks you to internalize a lot of implicit behavior (especially around caching and where code runs) and I got tired of fighting it. ([Next.js Caching](https://nextjs.org/docs/app/guides/caching))

So for Toodyloo, I chose TanStack Start. These are *my* reasons:

1. **I’m done with RSC mental gymnastics as the default**  
   I don’t want to constantly think “server component or client component?”, “what invalidates what?”, and “why did this render on the server again?” TanStack Start’s model keeps boundaries more explicit and easier to reason about. ([TanStack Start Comparison](https://tanstack.com/start/latest/docs/framework/react/comparison))

2. **Server Functions feel like the pragmatic middle ground**  
   I want backend logic colocated with my app, but I want it *explicit* and callable in a way that’s easy to test and instrument. TanStack Start’s Server Functions are a clear abstraction for full-stack work without turning every mutation into framework ceremony. ([TanStack Start Server Functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions))

3. **Type-safe routing is non‑negotiable for serious apps**  
   When routes are a stringly-typed minefield, refactors get scary. TanStack Router’s type-safety makes route params and navigation fail at compile time instead of in production. ([TanStack Start vs Next.js](https://tanstack.com/start/latest/docs/framework/react/start-vs-nextjs))

4. **The data layer is predictable (TanStack Query + explicit patterns)**  
   I already trust TanStack Query’s primitives for caching, invalidation, optimistic updates, and retries. Start fits that mental model cleanly, which makes app behavior more consistent and debugging way less painful. ([TanStack Start Overview](https://tanstack.com/start/latest/docs))

5. **Portability matters (I don’t want my framework picking my platform)**  
   I deploy where it makes sense. This app runs on Netlify with first‑class support (SSR + server functions) via an official framework guide. ([Netlify: TanStack Start setup guide](https://docs.netlify.com/build/frameworks/framework-setup-guides/tanstack-start/))

Next.js still has a place—Route Handlers and Server Actions can be great— but the tradeoffs are real, and for this project I wanted a system that stays understandable as it grows. ([Next.js Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers))

## Obstacles and Solutions

### Obstacle: Optimistic UI with Error Handling

Building optimistic UI updates that gracefully handle errors and provide good user experience was challenging. Users expect instant feedback, but network requests can fail.

### Solution:

I implemented a comprehensive optimistic operations system that:
- Tracks all pending operations with unique IDs
- Shows real-time progress indicators
- Automatically rolls back failed operations
- Displays user-friendly error messages
- Provides retry functionality
- Logs all operations to an activity drawer

This system uses React Query mutations with optimistic updates, a global context for tracking operations, and Sentry for error reporting.

- - -

### Obstacle: Type Safety Across the Stack

Maintaining type safety from the database layer through server functions to the UI was important but complex, especially with dynamic queries and mutations.

### Solution:

I used a combination of:
- **Drizzle ORM** for type-safe database queries with inferred types
- **Zod schemas** for runtime validation that also provide TypeScript types
- **TanStack Router** for type-safe routing and server functions
- **Shared type definitions** that flow from database schema to UI components

This ensures that a change in the database schema automatically propagates type errors throughout the codebase, catching bugs at compile time.

- - -

### Obstacle: AI Integration with Privacy Concerns

Integrating AI features while maintaining user privacy and compliance with data protection regulations required careful consideration.

### Solution:

I implemented:
- Clear privacy notices in the AI dialog
- Warnings about not sharing sensitive information
- Links to Privacy Policy and Terms of Service
- Proper data handling in server functions
- User education about AI processing

The AI features are clearly marked, and users are informed that their input may be processed by third-party services.

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
- [Shadcn UI](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zod](https://zod.dev/)
- [Netlify](https://www.netlify.com/)
