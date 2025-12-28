# DecapCMS Content Guide

A guide for content editors explaining what each field does and where it appears on the website.

---

## Table of Contents

1. [Overview](#overview)
2. [Site Settings](#site-settings)
3. [Navigation & Footer](#navigation--footer)
4. [Homepage](#homepage)
5. [Page Content](#page-content)
6. [Profile](#profile)
7. [Technologies](#technologies)
8. [Organizations](#organizations)
9. [Roles (Experience)](#roles-experience)
10. [Projects](#projects)
11. [Blog Posts](#blog-posts)
12. [Additional Collections](#additional-collections)
13. [Understanding Relationships](#understanding-relationships)

---

## Overview

This site uses a structured content system where different pieces of content are stored separately and connected through relationships. This means you only need to update information once, and it automatically updates everywhere it appears on the site.

**For example:** If you update a technology name from "Vue" to "Vue.js" in the Technologies section, that change appears automatically on all projects, blog posts, and experience entries that reference it.

---

## Site Settings

**Location in CMS:** Site → Settings

These fields control global site information that appears across all pages.

### Fields

**Site Title**

- **What it does:** Main site name
- **Where it appears:** Browser tab title, search engine results, page header logo text

**Site Description**

- **What it does:** Brief description of the site
- **Where it appears:** Search engine results, social media previews

**Site URL**

- **What it does:** Your website's full URL
- **Example:** `https://www.aaronmolina.me`

**Keywords**

- **What it does:** Search terms related to your site
- **Where it appears:** Meta tags for SEO

**Author Information**

- **Name:** Your full name
- **Email:** Contact email
- **URL:** Personal website or portfolio URL
- **Bio:** Short biography
- **Location:** City/state/country
- **Social Links:** Platform, label, URL, and aria label for each social account
  - **Where it appears:** Footer social icons, contact page

**Contact Information**

- **Email, Phone, Address:** Public contact details
- **Where it appears:** Contact page, footer

**Analytics**

- **Umami Script URL:** Analytics tracking script
- **Umami Website ID:** Your analytics site ID
- **What it does:** Enables privacy-friendly website analytics

## Navigation & Footer

### Navigation

**Location in CMS:** Site → Navigation

**Brand Text**

- **What it does:** Your name or brand
- **Where it appears:** Top-left corner of every page header

**Brand Alt Text**

- **What it does:** Accessibility text for screen readers
- **Where it appears:** Header logo/brand link

**Navigation Items**

- **Label:** Menu item text (e.g., "Projects", "Experience", "Blog")
- **Href:** Page URL (e.g., "/projects", "/experience")
- **Icon Key:** Optional icon name
- **Where it appears:** Main navigation menu in the header

### Footer

**Location in CMS:** Site → Footer

**Copyright Owner Name**

- **What it does:** Name for copyright notice
- **Where it appears:** Footer copyright line

**Copyright Suffix**

- **What it does:** Additional copyright text
- **Example:** "All rights reserved."
- **Where it appears:** After copyright year and name

**Show Social Links**

- **What it does:** Toggle social icons on/off
- **Where it appears:** Footer (uses social links from Settings)

---

## Homepage

**Location in CMS:** Site → Homepage

### Years of Experience

**Years of Experience Start Year**

- **What it does:** The year you started your career
- **How it works:** Site automatically calculates years between this year and current year
- **Where it appears:** Homepage hero section, experience page

### Hero Section

**Name**

- **What it does:** Your full name
- **Where it appears:** Large text at top of homepage

**Headline**

- **What it does:** Your job title or tagline
- **Where it appears:** Below your name on homepage

**Description**

- **What it does:** Brief introduction paragraph
- **Special:** Use `{yearsOfExperience}` in the text and it will automatically show your calculated years
- **Example:** "With over {yearsOfExperience} years of experience..."
- **Where it appears:** Hero section on homepage

---

## Page Content

**Location in CMS:** Site → Pages

This section contains all the text content for various pages. Each page has its own subsection.

### Home Page Buttons & Sections

**Buttons**

- **View Work Label:** Text for project button
- **Read Blog Label:** Text for blog button

**Sections**

- **Featured Projects Title:** Heading for projects section
- **Featured Projects View All Label:** Link text to see all projects
- **Experience Title:** Heading for experience section
- **Experience View All Label:** Link text to see full experience
- **Latest Articles Title:** Heading for blog section
- **Latest Articles View All Label:** Link text to see all articles

### Projects Index Page

- **Meta Title:** Browser tab title for /projects
- **Meta Description:** Description for search engines
- **Heading:** Main page heading
- **Intro:** Introductory paragraph
- **Empty State:** Message shown when no projects exist

### Blog Index Page

- **Meta Title:** Browser tab title for /blog
- **Meta Description:** Description for search engines
- **Heading:** Main page heading
- **Intro:** Introductory paragraph
- **Empty State:** Message shown when no posts exist

### Experience Page

- **Meta Title:** Browser tab title
- **Meta Description:** Description for search engines
- **Heading:** Main page heading
- **Subheading Template:** Subtitle text (use `{yearsOfExperience}` for dynamic years)
- **Intro:** Introductory paragraph
- **Work Experience Section Title:** Heading for experience timeline
- **Career Highlights Section Title:** Heading for highlights section
- **Key Achievements Title:** Heading for achievements list
- **Core Competencies Title:** Heading for competencies section
- **Core Competencies Items:** List of skills with title and description

### Contact Page

- **Meta Title:** Browser tab title
- **Meta Description:** Description for search engines
- **Heading:** Main page heading
- **Intro:** Introductory text
- **Form Title:** Heading above contact form
- **Why Work With Me Title:** Section heading
- **Why Work With Me Items:** List of benefits (title + description)
- **Response Time Title:** Section heading
- **Response Time Items:** List of time-related commitments
- **Ready To Start Title:** Section heading
- **Ready To Start Description:** Call-to-action text
- **Ready Links:** Button labels for projects and experience links
- **Social Section Title:** Heading for social media section
- **Social Section Description:** Text explaining how to connect on social media

---

## Call To Action

**Location in CMS:** Site → Call To Action

**Title**

- **What it does:** CTA heading
- **Where it appears:** CTA section on various pages

**Description**

- **What it does:** CTA supporting text
- **Where it appears:** Below CTA title

**Button Label**

- **What it does:** Text on the CTA button
- **Example:** "Get in Touch", "View My Work"

**Button Href**

- **What it does:** Where the button links to
- **Example:** "/contact", "/projects"

---

## Profile

**Location in CMS:** Profile → Profile

This is your personal profile information (currently not displayed on site, but prepared for future resume generation).

**Fields:**

- **Full Name:** Your complete name
- **Headline:** Professional title
- **Summary:** Professional summary paragraph
- **Location:** City/state/country
- **Website:** Personal website URL
- **Email:** Contact email
- **Phone:** Contact phone number
- **Avatar:** Profile photo
- **Availability:** Current work status (open_to_work, available_for_contract, not_available)
- **Primary Roles:** List of your main job titles/specializations

---

## Technologies

**Location in CMS:** Technologies

Technologies are skills, tools, frameworks, platforms, and concepts you use. They can be referenced by projects, blog posts, and experience entries.

### Fields

**Name (Display Name)**

- **What it does:** Human-readable name
- **Example:** "Vue.js", "TypeScript", "Tailwind CSS"
- **Where it appears:** Technology badges on projects, blog posts, experience cards

**Slug (Machine Name)**

- **What it does:** Unique identifier for relationships
- **Example:** "vue", "typescript", "tailwind"
- **Note:** This is what gets stored when you link a technology to a project/post/role

**Category**

- **What it does:** Classifies the technology type
- **Options:** language, framework, library, tool, platform, service, cms, concept, other
- **Use:** Can be used to group or filter technologies

**URL**

- **What it does:** Link to official website or documentation
- **Optional**

**Level**

- **What it does:** Your proficiency level
- **Options:** beginner, intermediate, advanced, expert
- **Optional**

**Years**

- **What it does:** How many years you've used this technology
- **Optional**

**Featured**

- **What it does:** Highlight this technology
- **Where it appears:** Can be used to show key skills prominently
- **Default:** Off

**Sort Order**

- **What it does:** Control display order (lower numbers first)
- **Default:** 0

---

## Organizations

**Location in CMS:** Organizations

Companies, clients, or teams you've worked with. These can be referenced by roles and projects.

### Fields

**Name**

- **What it does:** Company name
- **Example:** "Acme Corp", "Freelance", "Self-Employed"

**Slug**

- **What it does:** Unique identifier
- **Example:** "acme-corp", "freelance"

**Website**

- **What it does:** Company website URL
- **Optional**

**Location**

- **What it does:** Company location
- **Example:** "San Francisco, CA" or "Remote"
- **Optional**

**Logo**

- **What it does:** Company logo image
- **Where it appears:** Can appear on experience cards and project cards
- **Optional**

**Industry**

- **What it does:** Company's industry or sector
- **Example:** "E-commerce", "Healthcare", "Education"
- **Optional**

**Summary**

- **What it does:** Brief description of the company
- **Optional**

**Featured**

- **What it does:** Highlight this organization
- **Default:** Off

**Sort Order**

- **What it does:** Control display order
- **Default:** 0

---

## Roles (Experience)

**Location in CMS:** Roles

Individual job positions or contracts. These form your work experience timeline.

### Fields

**Title**

- **What it does:** Job title
- **Example:** "Senior Frontend Developer", "Technical Lead"
- **Where it appears:** Experience cards, experience page

**Slug**

- **What it does:** Unique identifier
- **Example:** "acme-senior-developer"

**Organization**

- **What it does:** Links to the company you worked for
- **Type:** Relationship field (select from Organizations)
- **Required**

**Location**

- **What it does:** Where the job was based
- **Example:** "New York, NY" or "Remote"
- **Optional**

**Employment Type**

- **What it does:** Type of employment
- **Options:** full_time, part_time, contract, freelance, internship
- **Optional**

**Start Date**

- **What it does:** When you started this role
- **Required**
- **Where it appears:** Experience timeline ("Jan 2022 - Present")

**End Date**

- **What it does:** When you left this role
- **Optional** (leave empty if current)

**Current**

- **What it does:** Check this if you're still in this role
- **Effect:** Shows "Present" instead of end date
- **Default:** Off

**Summary**

- **What it does:** Brief overview of the role
- **Where it appears:** Experience card description
- **Optional**

**Highlights**

- **What it does:** List of key responsibilities
- **Where it appears:** Experience detail view
- **Optional**

**Achievements**

- **What it does:** Notable accomplishments in this role
- **Where it appears:** Experience detail view
- **Optional**

**Technologies**

- **What it does:** Skills and tools used in this role
- **Type:** Relationship field (select from Technologies)
- **Where it appears:** Technology badges on experience cards
- **Optional**

**Projects**

- **What it does:** Projects completed during this role
- **Type:** Relationship field (select from Projects)
- **Optional**

**Featured**

- **What it does:** Show this role on the homepage
- **Where it appears:** Homepage experience section
- **Default:** Off

**Sort Order**

- **What it does:** Control display order (lower numbers first)
- **Use:** Featured roles use this for ordering
- **Default:** 0

**Active (show on site)**

- **What it does:** Hide/show this role without deleting it
- **Default:** On

---

## Projects

**Location in CMS:** Projects

Portfolio projects showcasing your work.

### Fields

**Title**

- **What it does:** Project name
- **Where it appears:** Project cards, project page title, browser tab

**Slug**

- **What it does:** URL identifier
- **Example:** "ecommerce-dashboard" creates `/projects/ecommerce-dashboard`

**Summary**

- **What it does:** Brief project description
- **Where it appears:** Project card on homepage and projects listing

**Technologies**

- **What it does:** Tech stack used in the project
- **Type:** Relationship field (select from Technologies)
- **Where it appears:** Technology badges on project cards and detail page
- **Optional**

**Featured Image**

- **What it does:** Main project image
- **Where it appears:** Project page hero, project cards
- **Optional**

**Live URL**

- **What it does:** Link to the live/production website
- **Where it appears:** "View Live Site" button on project page
- **Optional**

**Repo URL**

- **What it does:** Link to GitHub/GitLab repository
- **Where it appears:** "View Code" button on project page
- **Optional**

**Organization**

- **What it does:** Client or company this project was for
- **Type:** Relationship field (select from Organizations)
- **Where it appears:** Project detail page ("Project for Acme Corp")
- **Optional**

**Roles**

- **What it does:** Which job roles this project was part of
- **Type:** Relationship field (select from Roles)
- **Optional**

**Body**

- **What it does:** Full project description and details
- **Format:** Markdown (supports headings, lists, links, images)
- **Where it appears:** Project detail page main content
- **Optional**

**Completed On**

- **What it does:** Project completion date
- **Where it appears:** Project metadata
- **Optional**

**Is Active**

- **What it does:** Show/hide project without deleting it
- **Default:** On

**Featured**

- **What it does:** Show this project on the homepage
- **Where it appears:** Homepage featured projects section
- **Default:** Off

**Sort Order**

- **What it does:** Control display order (lower numbers first)
- **Use:** Controls order on homepage and projects page
- **Default:** 0

---

## Blog Posts

**Location in CMS:** Blog Posts

Articles, tutorials, and thoughts.

### Fields

**Title**

- **What it does:** Blog post title
- **Where it appears:** Post listings, post page, browser tab

**Slug**

- **What it does:** URL identifier
- **Example:** "my-first-post" creates `/blog/my-first-post`

**Publish Date**

- **What it does:** When the post was published
- **Where it appears:** Post metadata, post cards
- **Used for:** Sorting posts (newest first)

**Updated Date**

- **What it does:** When the post was last edited
- **Where it appears:** "Updated on..." note on post page
- **Optional**

**Description**

- **What it does:** Short post summary
- **Where it appears:** Post cards, search engine results, social media previews
- **Optional**

**Featured Image**

- **What it does:** Post hero image
- **Where it appears:** Post page header, post cards
- **Optional**

**Tags**

- **What it does:** Topics the post covers
- **Type:** Relationship field (select from Technologies)
- **Where it appears:** Tag badges below post title
- **Optional**

**Body**

- **What it does:** Full post content
- **Format:** Markdown (supports code blocks, headings, lists, images, links)
- **Where it appears:** Post page main content

---

## Additional Collections

### Education

**Location in CMS:** Education

Your educational background (not currently displayed on site, prepared for future use).

**Fields:** School, degree, field of study, dates, location, highlights, sort order, active status

### Certifications

**Location in CMS:** Certifications

Professional certifications and credentials (not currently displayed on site).

**Fields:** Name, issuer, issue/expiration dates, credential URL, related technologies, sort order, active status

### Awards

**Location in CMS:** Awards

Recognition and awards received (not currently displayed on site).

**Fields:** Title, issuer, date, description, URL, sort order, active status

### Testimonials

**Location in CMS:** Testimonials

Client and colleague testimonials (not currently displayed on site).

**Fields:** Name, role, organization (relationship), quote, URL, featured, sort order, active status

### Services

**Location in CMS:** Services

Services you offer (not currently displayed on site).

**Fields:** Title, summary, deliverables list, technologies (relationship), featured, sort order, active status

---

## Understanding Relationships

### How Relationships Work

When you see a **relationship field** (like "Technologies" in a project or "Organization" in a role), you're creating a connection to another piece of content without duplicating it.

**Example Scenario:**

1. You create a technology: **"Vue.js"** with slug **"vue"**
2. You create a project and select **"Vue.js"** in the Technologies field
3. The project stores the slug: **"vue"**
4. On the website, it displays: **"Vue.js"**

**Why This Matters:**

If you later update the technology name from "Vue.js" to "Vue 3", that change appears automatically on all projects, blog posts, and roles that reference it. You don't have to update each one individually.

### Common Relationships

- **Projects → Technologies:** Shows tech stack badges
- **Projects → Organizations:** Shows client/company info
- **Projects → Roles:** Links projects to job experience
- **Roles → Organizations:** Shows employer
- **Roles → Technologies:** Shows skills used
- **Roles → Projects:** Links experience to portfolio
- **Blog Posts → Technologies:** Shows topic tags
- **Testimonials → Organizations:** Shows where testimonial is from

### Featured vs Active

**Featured**

- **Purpose:** Highlight important items
- **Effect:** Appears on homepage
- **Examples:** Your best projects, current/recent roles

**Active (Is Active)**

- **Purpose:** Show/hide items without deleting them
- **Effect:** When off, item is hidden from the entire site
- **Use case:** Temporarily hide outdated projects or old roles

### Sort Order

**How It Works:**

- Lower numbers appear first (0, 1, 2...)
- Items with the same number may appear in any order
- Featured items are typically sorted by Sort Order

**Example:**

- Project A: Featured ✓, Sort Order: 1
- Project B: Featured ✓, Sort Order: 3
- Project C: Featured ✓, Sort Order: 2

**Result on Homepage:** Project A → Project C → Project B

---

## Quick Reference

### Where Content Appears

| CMS Location              | Appears On                 | What It Controls                           |
| ------------------------- | -------------------------- | ------------------------------------------ |
| **Site → Settings**       | All pages                  | Site title, meta description, social links |
| **Site → Navigation**     | Header (all pages)         | Menu items, brand text                     |
| **Site → Footer**         | Footer (all pages)         | Copyright, social link toggle              |
| **Site → Homepage**       | Homepage                   | Hero section text, years of experience     |
| **Site → Pages**          | Various pages              | Page headings, intros, button labels       |
| **Site → Call To Action** | CTA sections               | CTA title, description, button             |
| **Profile**               | (future use)               | Personal profile data for resume           |
| **Technologies**          | Projects, blog, experience | Technology names and badges                |
| **Organizations**         | Experience, projects       | Company names, logos, details              |
| **Roles**                 | Homepage, /experience      | Job titles, dates, responsibilities        |
| **Projects**              | Homepage, /projects        | Portfolio items                            |
| **Blog Posts**            | /blog                      | Articles and tutorials                     |
| **Education**             | (future use)               | Educational background                     |
| **Certifications**        | (future use)               | Professional credentials                   |
| **Awards**                | (future use)               | Recognition and awards                     |
| **Testimonials**          | (future use)               | Client/colleague quotes                    |
| **Services**              | (future use)               | Services offered                           |

### Common Field Types

| Field Type   | Description                | Example                                    |
| ------------ | -------------------------- | ------------------------------------------ |
| **String**   | Short text (one line)      | "Senior Frontend Developer"                |
| **Text**     | Long text (paragraph)      | Project description                        |
| **Markdown** | Formatted content          | Blog post body with headings, lists, links |
| **Image**    | Upload a photo/image       | Featured image, logo                       |
| **Datetime** | Date picker                | Publish date, start date, end date         |
| **Boolean**  | On/off toggle              | Featured, Active, Current                  |
| **Number**   | Numeric value              | Sort order, years of experience            |
| **Select**   | Choose from dropdown       | Category, employment type, level           |
| **List**     | Multiple items             | Tags, highlights, deliverables             |
| **Relation** | Link to another collection | Technologies, organization, roles          |

### Tips for Content Editors

1. **Use Slugs Wisely** — Once a slug is set, avoid changing it (it's used in URLs)

2. **Featured Items** — Only feature your best/most recent 3-5 items per section

3. **Sort Order** — Start with 0, increment by 10 (gives room to insert items later)

4. **Active vs Delete** — Use "Active" toggle to hide items instead of deleting them

5. **Relationships Save Time** — Create technologies/organizations once, reuse everywhere

6. **Markdown Support** — Use markdown in Body fields for rich formatting:

   ```markdown
   # Heading

   ## Subheading

   - Bullet point
   - Another point

   [Link text](https://example.com)

   **Bold text**
   _Italic text_
   ```

7. **Years of Experience** — Set the start year once, the site calculates years automatically

8. **Preview Changes** — After saving in CMS, check the live site to see your changes

---

## Getting Help

### Accessing the CMS

Visit `/admin` on your website to access the content management system.

### Making Changes

1. Navigate to the collection you want to edit
2. Click on an existing entry or "New [Item]" to create one
3. Fill in the fields
4. Click "Save" to publish changes
5. Changes appear on the live site after the build completes (usually 1-2 minutes)

### Understanding Error Messages

If you see an error when saving:

- **"Required field"** — Fill in all required fields (marked with \*)
- **"Invalid URL"** — Check URL format (must include `https://`)
- **"Must be unique"** — Another item already uses that slug

### Content Best Practices

- Write clear, concise summaries (2-3 sentences)
- Use high-quality images (recommended: 1200px+ wide)
- Keep technology names consistent (e.g., always "Vue.js", not "Vue" or "VueJS")
- Add meaningful slugs (use hyphens: "my-project" not "my_project" or "MyProject")
- Fill in optional fields when possible (richer content = better SEO)

---

This guide is designed for content editors and site administrators. For technical implementation details, see the developer documentation.
