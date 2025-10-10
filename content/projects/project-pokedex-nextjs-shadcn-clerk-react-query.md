---
title: Pokedex App using Next.js, Shadcn UI, Clerk, and React Query
slug: project-pokedex-nextjs-shadcn-clerk-react-query
description: A pokedex app showcasing the use of Next.js, Shadcn UI, Clerk, and React Query.
tags:
  - nextjs
  - shadcn
  - clerk
  - react-query
  - tailwind
  - typescript
  - javascript
  - git
  - graphql
  - chart.js
  - graphql-codegen
  - restful-apis

featuredImage: /images/project-pokedex-nextjs-shadcn-clerk-react-query.png
link: https://pokedex-next-clerk-react-query.vercel.app
completedOn: 2025-10-10T00:00:00.000Z
isActive: true
pinned: true
githubLink: https://github.com/aaronm-git/pokedex-next-clerk-react-query
---

## Overview

This is a pokedex app showcasing the use of Next.js, Shadcn UI, Clerk, React Query and more. It is a pokedex app that allows you to search for a pokemon by name and view its details, abilities, and moves as well as collect your favorite pokemon for later viewing. Using the free pokemon API, look up more that 1000 pokemon and view their details, abilities, and moves and get a few helpful data visualizations with the pokemon data using Chart.js in the dashboard.

---

![Screenshot of Pokedex App using Next.js, Shadcn UI, Clerk, and React Query](/images/project-pokedex-nextjs-shadcn-clerk-react-query.png)

### 🛠️ Technical Breakdown

**Tech stack:**
I built a pokedex app using **Next.js**, **Shadcn UI**, **Clerk**, **React Query**, **GraphQL**, **TypeScript**, **Tailwind CSS**, **Restful APIs**, **Chart.js**, **Git**, **Vercel**.

- Built the frontend with **Next.js**
- Integrated the **PokeAPI** to fetch pokemon data using **GraphQL**
- Used **Shadcn UI** for the UI components
- Used **Clerk** for authentication
- Used **React Query** for data fetching
- Used **Restful APIs** to fetch pokemon data
- Used **Chart.js** for data visualizations
- Used **GraphQL Codegen** to generate types for the pokemon data
- Used **TypeScript** for type safety
- Used **Tailwind CSS** for styling
- Used **Git** for version control
- Used **Vercel** for deployment

## Key Features

- Search for a pokemon by name
- View a pokemon's details, abilities, and moves
- Loop up top all available pokemon in the Pokemon API
- Collect favorite pokemon and view your collection
- Login and logout using Clerk
- Responsive design
- Persist favorite pokemon in local storage
- Data visualizations for pokemon data using Chart.js in the dashboard

## Obstacles and Solutions

### Obstacle: Typescript support for GraphQL Queries

I ran into a problem where I realized the documentation was way too simple. It doesnt have helpful explanations on what data youre getting back from the GraphQL queries. And going back and forth between the documentation and the code was a pain.

### Solution:

I used the `graphql-codegen` library to generate types for all the GraphQL queries. This allowed me to use TypeScript to type the queries and mutations. The developer experience was a lot better and I was able to quickly know if GraphQL queries were working as expected without having to look at the documentation constantly.

---

### Obstacle: Rate limiting for the GraphQL API

Pokeapi.co has a daily limit of 200 requests. This would make it difficult to work on this project becasue eveyr hot reloading would make the requests to the API and I would hit the limit quickly. There was a a day where I couldnt continue working on this project becasue I hit the limit so I had to wait until the next day.

I also dont expect many people using this project daily but I wanted to make sure that I wasnt abusing the API and giving my visitors a bad experience.

### Solution:

I used the `react-query` library to cache the data and avoid making the same requests multiple times. I set the stale time and garbage collection time to infinity to avoid the data from expiring, since the data istn going to be chaning often in the API. This allowed me to avoid hitting the rate limit and make the requests to the API less frequently.

---

### Obstacle: Authentication

I like building projects with authentication. But I didnt want to focus too much on the authentication part. I think many companies today actually rely on external authentication providers like Google, Facebook, etc. So I decided to use Clerk to handle the authentication for me. This is more inline with real world applications.

### Solution:

I used the `clerk` to handle the authentication for me. Clerk is a great provider for auth because its easy to use and has a lot of features like social login, email login, and more and have a generous free tier and perfect for this project. The implementation wasnt too bad but I had to learn how to use the Clerk library to handle the authentication for me.

---

## Try It Out

### Installation

```bash
git clone https://github.com/aaronm-git/pokedex-next-clerk-react-query.git
cd pokedex-next-clerk-react-query
npm install
npm run dev
```

#### Environment Variables

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/app/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/app/dashboard
```

Make sure to use your Clerk publishable and secret keys. You can learn more about the environment variables in the [Clerk Documentation](https://clerk.com/docs/guides/development/clerk-environment-variables#clerk-publishable-and-secret-keys).

### License

MIT

### Author

Aaron Molina - Senior Frontend Developer

[Contact Me](https://aaronmolina.me/contact)

---

## Credits

- [PokeAPI](https://pokeapi.co/)
- [Next.js](https://nextjs.org/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Clerk](https://clerk.com/)
- [React Query](https://tanstack.com/query/latest)
- [GraphQL](https://graphql.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JavaScript](https://www.javascript.com/)
- [Git](https://git-scm.com/)
- [Vercel](https://vercel.com/)
- [Chart.js](https://www.chartjs.org/)
- [GraphQL Codegen](https://www.graphql-code-generator.com/)
