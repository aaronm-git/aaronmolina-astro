# SEO Keyword Research Template

Use this template when conducting SEO research for any portfolio or service website.

---

## Project Information

**Website:** [domain.com]
**Date:** [YYYY-MM-DD]
**Target Market:** [Country/Region]
**Primary Goal:** [e.g., Get hired, attract clients, sell services]

---

## Step 1: Define Target Audience

### Who do you want to find you via search?
- [ ] Recruiters / Hiring managers
- [ ] Direct clients / Brands
- [ ] Agencies looking for contractors
- [ ] Other developers (blog readers)
- [ ] Other: ___________

### Geographic focus:
- [ ] Local (City: ___________)
- [ ] Regional (State/Country: ___________)
- [ ] Remote (specify: US only / Global)

### Employment preference:
- [ ] W2 Employee
- [ ] Freelance / Contract
- [ ] Agency work
- [ ] All of the above

---

## Step 2: Define Your Niches (Pick 1-3)

- [ ] Framework: (React, Next.js, Astro, Vue, etc.)
- [ ] Architecture: (Jamstack, Headless CMS, Composable, etc.)
- [ ] Specialty: (Accessibility, Performance, E-commerce, etc.)
- [ ] Industry: (Sports, Entertainment, SaaS, etc.)
- [ ] Other: ___________

---

## Step 3: Seed Keywords to Research

Based on niches selected, generate seed keywords:

### Hire-intent keywords (high value)
```
hire [framework] developer
hire [architecture] developer
[framework] developer for hire
freelance [framework] developer
```

### Identity keywords (who you are)
```
[framework] developer
[architecture] developer
senior frontend developer
fullstack developer
```

### Service keywords (if offering services)
```
[framework] agency
[framework] development services
[architecture] development agency
```

### Location keywords
```
[city] [role]
remote [role]
[role] for hire [location]
```

---

## Step 4: Ahrefs Research Queries

### Query 1: Validate seed keywords
```
Tool: keywords-explorer-overview
Parameters:
  - select: keyword,volume,difficulty,traffic_potential,cpc,intents,parent_topic
  - country: [two-letter code, e.g., "us"]
  - keywords: [comma-separated seed keywords]
```

### Query 2: Expand with related terms
```
Tool: keywords-explorer-related-terms
Parameters:
  - select: keyword,volume,difficulty,traffic_potential,cpc,intents
  - country: [two-letter code]
  - keywords: [top seed keyword]
  - terms: all
  - limit: 30
  - order_by: volume:desc
```

### Query 3: SERP analysis for top keywords
```
Tool: serp-overview
Parameters:
  - select: position,url,title,domain_rating,traffic,backlinks,refdomains,top_keyword,type
  - country: [two-letter code]
  - keyword: [target keyword]
  - top_positions: 10
```

### Query 4: Competitor analysis
```
Tool: site-explorer-organic-keywords
Parameters:
  - select: keyword,volume,keyword_difficulty,best_position,sum_traffic,is_informational,is_commercial,is_transactional
  - target: [competitor domain]
  - mode: subdomains
  - country: [two-letter code]
  - date: [YYYY-MM-DD]
  - limit: 30
  - order_by: sum_traffic:desc
```

---

## Step 5: Keyword Categorization

### Tier 1 — Create Dedicated Pages
| Keyword | Volume | KD | Page URL | Priority |
|---------|--------|-----|----------|----------|
| | | | | |

### Tier 2 — Optimize Existing Pages
| Keyword | Volume | KD | Target Page | Action |
|---------|--------|-----|-------------|--------|
| | | | | |

### Tier 3 — Blog Content
| Keyword | Volume | KD | Post Idea |
|---------|--------|-----|-----------|
| | | | |

### Tier 4 — Use in Copy (low volume but relevant)
| Keyword | Where to Use |
|---------|--------------|
| | |

---

## Step 6: SERP Analysis Summary

For each Tier 1 keyword, document:

### Keyword: [keyword]
| Position | Domain | DR | Type | Notes |
|----------|--------|-----|------|-------|
| 1 | | | | |
| 2 | | | | |
| ... | | | | |

**Individuals ranking?** Yes/No
**Lowest DR in top 10:**
**Opportunity assessment:**

---

## Step 7: Competitor Insights

### Competitor 1: [domain]
**What they rank for:**
| Keyword | Position | Traffic |
|---------|----------|---------|
| | | |

**What they do well:**
-
**Gaps you can exploit:**
-

---

## Step 8: URL Structure Plan

### New Pages to Create
```
/hire                    → Primary: [keyword]
/hire/[specialty]        → Primary: [keyword]
/services/[service]      → Primary: [keyword]
```

### Existing Pages to Optimize
```
/                        → Add: [keywords]
/about                   → Add: [keywords]
/contact                 → Add: [keywords]
```

---

## Step 9: Title & Meta Templates

### Hire Page Template
```html
<title>Hire a [Role] | [Name] – [Tech Stack]</title>
<meta name="description" content="Looking to hire a [role]? I'm a [seniority] [role] with [X]+ years experience building [what you build] with [tech]. Available for [employment type]. [Location].">
```

### Service Page Template
```html
<title>[Service Name] | [Name/Brand] – [Differentiator]</title>
<meta name="description" content="[Service] for [target audience]. [What you do]. [Proof point]. [CTA].">
```

### Blog Post Template
```html
<title>[Primary Keyword] | [Name/Brand]</title>
<meta name="description" content="[Hook/question]. [What the post covers]. [Why reader should care].">
```

---

## Step 10: Implementation Checklist

### Phase 1: Core Pages
- [ ] Create primary hire/service pages
- [ ] Optimize homepage title/meta
- [ ] Add location info to hero
- [ ] Add navigation link to hire page

### Phase 2: Supporting Content
- [ ] Create secondary pages
- [ ] Optimize existing pages
- [ ] Add CTAs linking to hire pages

### Phase 3: Blog Content
- [ ] Write Tier 3 blog posts
- [ ] Interlink with service pages

### Phase 4: Technical
- [ ] Submit to Search Console
- [ ] Update sitemap
- [ ] Add internal links
- [ ] Mobile optimization check

### Phase 5: Off-site
- [ ] Update social profiles with links
- [ ] Submit to relevant directories
- [ ] Consider guest posting

---

## Quick Reference: Ahrefs Metrics

| Metric | What it means |
|--------|---------------|
| **Volume** | Monthly searches (higher = more opportunity) |
| **KD (Keyword Difficulty)** | 0-100 scale (lower = easier to rank) |
| **Traffic Potential** | Est. traffic if you rank #1 |
| **CPC** | Ad cost per click (higher = more commercial intent) |
| **DR (Domain Rating)** | Site authority 0-100 |
| **Intents** | Informational, Commercial, Transactional, Navigational |

### KD Benchmarks
- **0-10:** Easy — new sites can rank
- **11-30:** Medium — need good content + some links
- **31-50:** Hard — need authority + great content
- **51+:** Very hard — established sites only

---

*Template version 1.0 — Based on aaronmolina.me research (Feb 2026)*
