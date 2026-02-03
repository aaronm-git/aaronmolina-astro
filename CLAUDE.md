# Claude overarching rules

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
- Our frontend Design trend is Tactile Maximalism. Please follow the design trend when creating new components or refactoring existing components.

## Package Manager Rules

- Always use Pnpm as the package manager.

## Content

- When writing content do not use em dashes. Rephrase or use other punctuation marks instead.
- Use proper punctuation and grammar otherwise.
- Avoid using complex words or phrases. Use simpler words or phrases instead.
- Check SEO best practices for content writing and our GOALS for proper content writing.
- Check AHREFS MCP but keep your content aligned with our Keyword Research and SEO Goals already defined in the SEO-KEYWORD-RESEARCH.md file.
