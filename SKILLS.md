# Skill Labels System

This document explains how the machine label → human label mapping system works for skills/technologies in your portfolio.

## How It Works

### Machine Labels (in Markdown)
Your project markdown files use **machine labels** (kebab-case slugs):

```markdown
---
technologies:
  - next-js
  - react
  - typescript
  - anthropic-claude
  - react-pdf
---
```

### Human Labels (on Frontend)
The `skill-labels.json` file maps these machine labels to human-readable display names:

```json
{
  "next-js": "Next.js",
  "react": "React.js",
  "typescript": "TypeScript",
  "anthropic-claude": "Anthropic Claude",
  "react-pdf": "React PDF"
}
```

## Auto-Generation

The mapping is **automatically generated** from your `technologies` collection.

### Running the Generation Script

```bash
# Automatic (runs before dev and build)
npm run dev
npm run build

# Manual (if you need to regenerate)
npm run skills:generate
```

### What It Does

The script:
1. Scans `src/content/technologies/*.json` files
2. Extracts the `slug` (machine label) and `name` (human label) from each
3. Generates `src/data/skill-labels.json` with the complete mapping
4. Sorts alphabetically for consistency

## Frontend Usage

Import the utility function to get human labels:

```tsx
import { getSkillLabel, getSkillLabels } from '@/utils/skill-labels';

// Get single label
const label = getSkillLabel('next-js'); // Returns: "Next.js"

// Get multiple labels
const labels = getSkillLabels(['react', 'typescript']);
// Returns: ["React.js", "TypeScript"]

// Get all labels (for debugging)
import { getAllSkillLabels } from '@/utils/skill-labels';
const allLabels = getAllSkillLabels();
```

## Adding New Technologies

1. Create a new JSON file in `src/content/technologies/`:
   ```json
   {
     "slug": "my-new-tool",
     "name": "My New Tool",
     "category": "tool",
     "featured": false
   }
   ```

2. Run `npm run skills:generate` (or it runs automatically before dev/build)

3. Use the machine label in your markdown files:
   ```markdown
   technologies:
     - my-new-tool
   ```

## Fallback Behavior

If a machine label doesn't have a mapping, the utility returns the machine label as-is:

```tsx
getSkillLabel('unknown-tech'); // Returns: "unknown-tech"
```

This prevents errors if a technology file hasn't been created yet.
