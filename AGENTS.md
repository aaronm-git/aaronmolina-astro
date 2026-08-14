# Codex overarching rules

## Typesafety and Typescript Rules

- Always use TypeScript
- Always use Zod schemas for validation
- Do not use assertions unless absolutely necessary. Use Zod schemas to validate data.
- Do not use any other validation library than Zod.

## Astro Rules

- Always use Astro's Content Collections for content management.

## Tailwind Rules

- Always use Tailwind utility and variant classes, including responsive, color mode, and state classes, to ensure consistent, maintainable styling following Tailwind best practices.
- Always use Tailwind's preflight classes for styling.

## Component Structure Rules

- Always use the component structure as defined in the ARCHITECTURE-PLAN.md file.
- Please follow Atomic Design principles when creating new components.
- If components are not following the Atomic Design principles, please refactor them to follow the principles.
- Components must be typed using TypeScript interfaces.
- All components must use JSdoc for documentation.

## Forntend Framework Rules

- If it can be done with Astro, do it with Astro but if React is easier and reduces complexity, use React for such components. For the most part, Astro is the better choice.
- Use GSAP for animations. If any other animation library is present, please refactor it to use GSAP and remove the other libraries.
- Our frontend design trend is Industrial Grotesk: hard-edged neo-brutalist system with an OKLCH ink/concrete/signal-green palette, Archivo Black + IBM Plex Mono type pairing, 2px ink borders, hard offset shadows (no blur), and a fixed alternating dark/light section rhythm (no theme toggle). Please follow the design trend when creating new components or refactoring existing components.

## Package Manager Rules

- Always use Pnpm as the package manager.

## Content

- When writing content do not use em dashes. Rephrase or use other punctuation marks instead.
- Use proper punctuation and grammar otherwise.
- Avoid using complex words or phrases. Use simpler words or phrases instead.
- Check SEO best practices for content writing and our GOALS for proper content writing.
- Check AHREFS MCP but keep your content aligned with our Keyword Research and SEO Goals already defined in the SEO-KEYWORD-RESEARCH.md file.

## Response Format

- Answer the task in plain prose with real detail. Do not wrap the main answer in a group or put it under a "Done" heading.
- Only side material gets grouped, and only when there is genuinely something to put in it. Most replies have neither group.
- **Recommended, not urgent**: things noticed while working that were deliberately not acted on.
- **Needs your call**: steps not taken, or anything that needs confirmation first, especially outward-facing or hard-to-reverse actions.
- Never add a group to satisfy the format. A group earns its place only when something actually surfaced during this task.
- Do not restate an open item that was already raised. Mention it once, then let it go unless something changes.
- No horizontal rules between groups. The bold headers do the separating.
- No `result:` line.
