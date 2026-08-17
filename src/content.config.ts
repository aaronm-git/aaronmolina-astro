import { fileURLToPath } from 'node:url';

import fg from 'fast-glob';

import { defineCollection, reference, z } from 'astro:content';
import { glob, type Loader } from 'astro/loaders';

type GlobOptions = Parameters<typeof glob>[0];

/**
 * Returns a glob loader that stays quiet when an optional collection directory is empty.
 */
function optionalGlob(globOptions: GlobOptions): Loader {
  const baseLoader = glob(globOptions);

  return {
    ...baseLoader,
    name: 'optional-glob-loader',
    async load(context) {
      const baseDir = globOptions.base ? new URL(globOptions.base, context.config.root) : context.config.root;
      const basePath = fileURLToPath(baseDir);
      const files = await fg(globOptions.pattern, {
        cwd: basePath,
        dot: false,
        onlyFiles: true,
      });

      if (files.length > 0) {
        await baseLoader.load(context);
        return;
      }

      context.store.clear();

      if (!context.watcher || context.meta.has('optional-glob-watcher')) {
        return;
      }

      context.meta.set('optional-glob-watcher', 'true');
      context.watcher.add(basePath);

      const reload = async (changedPath: string) => {
        if (!changedPath.startsWith(basePath)) {
          return;
        }

        await baseLoader.load(context);
      };

      context.watcher.on('add', reload);
      context.watcher.on('change', reload);
      context.watcher.on('unlink', reload);
    },
  };
}

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/blog',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string().refine(value => !/^(\d{4}-\d{2}-\d{2}|\d{6})-/.test(value), 'Blog slugs must not start with a date; blog URLs are /blog/<slug>.'),
      publishDate: z.date().or(z.null()),
      updatedDate: z.date().optional().default(new Date()),
      description: z.string().optional(),
      image: image().optional(),
      tags: z.array(z.string()).default([]),
    }),
});

const legal = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/legal',
  }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    lastUpdated: z.coerce.date(),
  }),
});

const technologies = defineCollection({
  loader: glob({
    pattern: '**/*.json',
    base: './src/content/technologies',
  }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    category: z.enum(['language', 'framework', 'library', 'tool', 'platform', 'service', 'cms', 'concept', 'other']).default('other'),
    url: z.string().optional(),
    level: z.number().min(1).max(10).optional(),
    years: z.number().optional(),
    projects: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    sortOrder: z.number().int().default(0),
    logo: z.string().min(1).optional(),
    shortLabel: z.string().optional(),
  }),
});

const organizations = defineCollection({
  loader: glob({
    pattern: '**/*.json',
    base: './src/content/organizations',
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      slug: z.string(),
      website: z.string().optional(),
      location: z.string().optional(),
      logo: image().optional(),
      /** Optical size correction so logos of differing ink density read at equal weight. */
      logoScale: z.number().min(0.1).max(1).default(1),
      /** True when the mark is painted on its own opaque plate. Such logos cannot be knocked out to white on a dark rail, since the fill floods the plate and erases the mark inside it. */
      logoHasBackdrop: z.boolean().default(false),
      industry: z.string().optional(),
      summary: z.string().optional(),
      featured: z.boolean().default(false),
      sortOrder: z.number().int().default(0),
    }),
});

const roles = defineCollection({
  loader: glob({
    pattern: '**/*.json',
    base: './src/content/roles',
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    organization: z.string(),
    location: z.string().optional(),
    employmentType: z
      .union([z.enum(['full_time', 'part_time', 'contract', 'freelance', 'internship']), z.literal('')])
      .optional()
      .transform(val => (val === '' ? undefined : val)),
    startDate: z.union([z.string(), z.date()]).transform(val => (typeof val === 'string' ? new Date(val) : val)),
    endDate: z
      .union([z.string(), z.date(), z.null()])
      .optional()
      .transform(val => {
        if (typeof val === 'string') return new Date(val);
        if (val === null) return undefined;
        return val;
      }),
    current: z.boolean().default(false),
    summary: z.string().optional(),
    highlights: z.array(z.string()).default([]),
    achievements: z.array(z.string()).default([]),
    technologies: z.array(z.string()).default([]),
    projects: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    sortOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
  }),
});

const profile = defineCollection({
  loader: glob({
    pattern: '**/*.json',
    base: './src/content/profile',
  }),
  schema: ({ image }) =>
    z.object({
      fullName: z.string(),
      headline: z.string(),
      summary: z.string(),
      location: z.string().optional(),
      website: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      avatar: image().optional(),
      availability: z.enum(['open_to_work', 'available_for_contract', 'not_available']).optional(),
      primaryRoles: z.array(z.string()).default([]),
    }),
});

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/projects',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      summary: z.string().optional(),
      technologies: z.array(z.string()).default([]),
      liveUrl: z.string().optional(),
      repoUrl: z.string().optional(),
      organization: z.string().optional(),
      roles: z.array(z.string()).default([]),
      featured: z.boolean().default(false),
      sortOrder: z.number().int().default(0),
      featuredImage: image().optional(),
      body: z.string().optional(),
      completedOn: z
        .union([z.string(), z.date()])
        .optional()
        .transform(val => {
          if (typeof val === 'string') {
            // Handle partial dates like "2022-07" by appending default day
            if (val.match(/^\d{4}-\d{2}$/)) {
              return new Date(val + '-01');
            }
            return new Date(val);
          }
          return val;
        }),
      isActive: z.boolean().default(true),
    }),
});

const testimonials = defineCollection({
  loader: optionalGlob({
    pattern: '**/*.json',
    base: './src/content/testimonials',
  }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    role: z.string().optional(),
    organization: z.string().optional(),
    quote: z.string(),
    highlight: z.string().optional(),
    url: z.string().optional(),
    featured: z.boolean().default(false),
    sortOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
  }),
});

const emailSignatureProfiles = defineCollection({
  loader: glob({
    pattern: '**/*.json',
    base: './src/content/email-signature-profiles',
  }),
  schema: z.object({
    fullName: z.string().min(1),
    title: z.string().min(1),
    specialization: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    location: z.string().min(1),
    website: z.string().url(),
    socials: z
      .array(
        z.object({
          platform: z.enum(['linkedin', 'github', 'twitter', 'instagram', 'facebook', 'youtube', 'bluesky', 'threads', 'mastodon', 'dribbble', 'behance']),
          url: z.string().url(),
        }),
      )
      .max(10),
    disclaimer: z.string().min(1),
  }),
});

const iconCtaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  icon: z.string().min(1).optional(),
});

const linkCtaSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const linkListSectionSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  viewAllLabel: z.string().min(1),
  viewAllHref: z.string().min(1),
});

export const homepageAiShowcaseSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  projects: z.array(reference('projects')).min(1),
});

export const homepagePortfolioChatSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  header: z.string().min(1),
  poweredBy: z.string().min(1),
  newChatLabel: z.string().min(1),
  greeting: z.string().min(1),
  inputPlaceholder: z.string().min(1),
  limitPlaceholder: z.string().min(1),
  sendLabel: z.string().min(1),
  errors: z.object({
    unsupported: z.string().min(1),
    connection: z.string().min(1),
    generic: z.string().min(1),
  }),
  disclaimer: z.object({
    text: z.string().min(1),
    linkLabel: z.string().min(1),
    linkHref: z.string().min(1),
  }),
  prompts: z.array(z.string().min(1)).min(1),
});

export const homepageSkillsShowcaseSchema = z.object({
  title: z.string().min(1),
  intro: z.string().min(1),
  proficiencyLabel: z.string().min(1),
  projectsLabel: z.string().min(1),
  masteredLabel: z.string().min(1),
  viewDetailsLabel: z.string().min(1),
  detailsLabel: z.string().min(1),
  closeLabel: z.string().min(1),
  tiers: z
    .array(
      z.object({
        min: z.number().int().min(0),
        label: z.string().min(1),
      }),
    )
    .min(1),
});

export type HomepageAiShowcase = z.infer<typeof homepageAiShowcaseSchema>;
export type HomepagePortfolioChat = z.infer<typeof homepagePortfolioChatSchema>;
export type HomepageSkillsShowcase = z.infer<typeof homepageSkillsShowcaseSchema>;

const siteHomepage = defineCollection({
  loader: glob({ pattern: 'homepage.json', base: './src/content/site' }),
  schema: ({ image }) =>
    z.object({
      yearsOfExperienceStartYear: z.number().int(),
      meta: z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
      hero: z.object({
        name: z.string().min(1),
        headline: z.string().min(1),
        subheadline: z.string().min(1),
        description: z.string().min(1),
        location: z.string().min(1),
        availability: z.string().min(1),
      }),
      heroDeck: z.object({
        cutout: image(),
        cutoutAlt: z.string().min(1),
        bubbleText: z.string().min(1),
        slides: z
          .array(
            z.object({
              image: image(),
              alt: z.string().min(1),
              label: z.string().min(1),
            }),
          )
          .min(1),
      }),
      trustedBy: z.object({
        title: z.string().min(1),
        companies: z
          .array(
            z.object({
              name: z.string().min(1),
              logo: image(),
              alt: z.string().min(1),
            }),
          )
          .min(1),
      }),
      aiShowcase: homepageAiShowcaseSchema,
      portfolioChat: homepagePortfolioChatSchema,
      skillsShowcase: homepageSkillsShowcaseSchema,
      featuredProjects: linkListSectionSchema,
      experience: linkListSectionSchema,
      hireLinks: z.object({
        eyebrow: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
        links: z
          .array(
            z.object({
              label: z.string().min(1),
              href: z.string().min(1),
              description: z.string().min(1),
            }),
          )
          .min(1),
      }),
      blog: linkListSectionSchema.extend({
        subtitle: z.string().min(1),
      }),
      cta: z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        primaryButton: iconCtaSchema,
        secondaryButton: iconCtaSchema,
      }),
      buttons: z.object({
        viewWorkLabel: z.string().min(1),
        readBlogLabel: z.string().min(1),
        hireMeLabel: z.string().min(1),
      }),
    }),
});

const hireMetaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const hireHeroSchema = z.object({
  headline: z.string().min(1),
  subheadline: z.string().min(1),
  description: z.string().min(1),
  badges: z.array(z.string().min(1)).min(1),
  primaryCta: iconCtaSchema,
  secondaryCta: iconCtaSchema,
});

export const hireServicesSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  items: z
    .array(
      z.object({
        phase: z.string().min(1),
        icon: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .min(1),
});

const hireFeaturesSchema = z.object({
  title: z.string().min(1),
  items: z
    .array(
      z.object({
        icon: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .min(1),
});

const hireSkillsSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  categories: z
    .array(
      z.object({
        name: z.string().min(1),
        icon: z.string().min(1),
        skills: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1),
});

const hireProjectsSchema = z.object({
  title: z.string().min(1),
  viewAllLabel: z.string().min(1),
  viewAllHref: z.string().min(1),
});

export const hireEngagementSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  customNote: z.string().min(1),
  customCta: linkCtaSchema,
  plans: z
    .array(
      z.object({
        eyebrow: z.string().min(1),
        name: z.string().min(1),
        description: z.string().min(1),
        features: z.array(z.string().min(1)).min(1),
        highlighted: z.boolean().optional(),
        cta: linkCtaSchema,
      }),
    )
    .min(1),
});

export const hireComparisonSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  criterionHeader: z.string().min(1),
  columns: z.array(z.string().min(1)).min(1),
  rows: z
    .array(
      z.object({
        criterion: z.string().min(1),
        values: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1),
});

const hireHowItWorksSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  steps: z
    .array(
      z.object({
        number: z.string().min(1),
        tag: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .min(1),
});

const hireVariantSchema = z.object({
  meta: hireMetaSchema,
  hero: hireHeroSchema,
  services: hireServicesSchema,
  features: hireFeaturesSchema,
  skills: hireSkillsSchema,
  projects: hireProjectsSchema,
});

const siteHire = defineCollection({
  loader: glob({ pattern: 'hire.json', base: './src/content/site' }),
  schema: z.object({
    yearsOfExperienceStartYear: z.number().int(),
    shared: z.object({
      stats: z
        .array(
          z.object({
            value: z.string().min(1),
            suffix: z.string().min(1),
            label: z.string().min(1),
            icon: z.string().min(1),
          }),
        )
        .min(1),
      cta: z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        buttonLabel: z.string().min(1),
        buttonHref: z.string().min(1),
      }),
      faq: z
        .array(
          z.object({
            question: z.string().min(1),
            answer: z.string().min(1),
          }),
        )
        .min(1),
      faqTitle: z.string().min(1),
      eyebrows: z.object({
        services: z.string().min(1),
        skills: z.string().min(1),
        faq: z.string().min(1),
      }),
    }),
    main: hireVariantSchema.extend({
      howItWorks: hireHowItWorksSchema,
      engagement: hireEngagementSchema,
      comparison: hireComparisonSchema,
    }),
    react: hireVariantSchema,
    nextjs: hireVariantSchema,
    headlessCms: hireVariantSchema,
  }),
});

const optionSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

export const contactFormSchema = z.object({
  nameLabel: z.string().min(1),
  namePlaceholder: z.string().min(1),
  emailLabel: z.string().min(1),
  emailPlaceholder: z.string().min(1),
  companyLabel: z.string().min(1),
  companyPlaceholder: z.string().min(1),
  projectTypeLabel: z.string().min(1),
  projectTypePlaceholder: z.string().min(1),
  budgetLabel: z.string().min(1),
  budgetPlaceholder: z.string().min(1),
  detailsLabel: z.string().min(1),
  detailsPlaceholder: z.string().min(1),
  submitLabel: z.string().min(1),
  projectTypeOptions: z.array(optionSchema).min(1),
  budgetOptions: z.array(optionSchema).min(1),
});

const pageMetaIntroSchema = z.object({
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  heading: z.string().min(1),
  intro: z.string().min(1),
});

const siteButtonsSchema = z.object({
  viewWorkLabel: z.string().min(1),
  readBlogLabel: z.string().min(1),
});

const sitePages = defineCollection({
  loader: glob({ pattern: 'pages.json', base: './src/content/site' }),
  schema: z.object({
    home: z.object({
      buttons: siteButtonsSchema,
      sections: z.object({
        featuredProjectsTitle: z.string().min(1),
        featuredProjectsViewAllLabel: z.string().min(1),
        experienceTitle: z.string().min(1),
        experienceViewAllLabel: z.string().min(1),
        latestArticlesTitle: z.string().min(1),
        latestArticlesViewAllLabel: z.string().min(1),
      }),
    }),
    projectsIndex: pageMetaIntroSchema.extend({
      emptyState: z.string().min(1),
    }),
    blogIndex: pageMetaIntroSchema.extend({
      emptyState: z.string().min(1),
    }),
    experience: pageMetaIntroSchema.extend({
      subheadingTemplate: z.string().min(1),
      workExperienceTitle: z.string().min(1),
      careerHighlightsTitle: z.string().min(1),
      keyAchievementsTitle: z.string().min(1),
      coreCompetenciesTitle: z.string().min(1),
      coreCompetencies: z
        .array(
          z.object({
            title: z.string().min(1),
            description: z.string().min(1),
          }),
        )
        .min(1),
    }),
    contact: pageMetaIntroSchema.extend({
      hireCta: z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        buttonLabel: z.string().min(1),
        buttonHref: z.string().min(1),
      }),
      formTitle: z.string().min(1),
      form: contactFormSchema,
      whyWorkWithMeTitle: z.string().min(1),
      whyWorkWithMeItems: z
        .array(
          z.object({
            title: z.string().min(1),
            description: z.string().min(1),
          }),
        )
        .min(1),
      responseTimeTitle: z.string().min(1),
      responseTimeItems: z.array(z.string().min(1)).min(1),
      readyToStartTitle: z.string().min(1),
      readyToStartDescription: z.string().min(1),
      readyLinks: z.object({
        viewProjectsLabel: z.string().min(1),
        viewExperienceLabel: z.string().min(1),
      }),
      socialSectionTitle: z.string().min(1),
      socialSectionDescription: z.string().min(1),
    }),
    blogTag: z.object({
      metaTitleTemplate: z.string().min(1),
      metaDescriptionTemplate: z.string().min(1),
      backLabel: z.string().min(1),
      countSuffixSingular: z.string().min(1),
      countSuffixPlural: z.string().min(1),
      emptyState: z.string().min(1),
    }),
    legal: z.object({
      eyebrow: z.string().min(1),
      lastUpdatedLabel: z.string().min(1),
      titleSuffix: z.string().min(1),
    }),
    blogPost: z.object({
      backLabel: z.string().min(1),
      updatedLabel: z.string().min(1),
      topicsLabel: z.string().min(1),
    }),
    projectDetail: z.object({
      backLabel: z.string().min(1),
      featuredBadge: z.string().min(1),
      liveLabel: z.string().min(1),
      sourceLabel: z.string().min(1),
      detailsHeading: z.string().min(1),
      quickFactsLabel: z.string().min(1),
      completionLabel: z.string().min(1),
      urlLabel: z.string().min(1),
      repoLabel: z.string().min(1),
      technologiesLabel: z.string().min(1),
    }),
    relatedPosts: z.object({
      title: z.string().min(1),
    }),
    authorBio: z.object({
      hireCta: linkCtaSchema,
      workCta: linkCtaSchema,
      contactCta: linkCtaSchema,
      basedInConnector: z.string().min(1),
    }),
  }),
});

const ctaBlockSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  buttonLabel: z.string().min(1),
  buttonHref: z.string().min(1),
});

const siteCta = defineCollection({
  loader: glob({ pattern: 'cta.json', base: './src/content/site' }),
  schema: ctaBlockSchema.extend({
    blogPost: ctaBlockSchema,
    projectDetail: ctaBlockSchema,
  }),
});

export const navHireLinkSchema = z.object({
  label: z.string().min(1),
  tabLabel: z.string().min(1),
  href: z.string().min(1),
});

const siteNavigation = defineCollection({
  loader: glob({ pattern: 'navigation.json', base: './src/content/site' }),
  schema: z.object({
    brandText: z.string().min(1),
    brandAlt: z.string().min(1),
    monogram: z.string().min(1),
    menuLabel: z.string().min(1),
    openMenuLabel: z.string().min(1),
    closeMenuLabel: z.string().min(1),
    siteMenuLabel: z.string().min(1),
    navItems: z
      .array(
        z.object({
          label: z.string().min(1),
          href: z.string().min(1),
          icon: z.string().min(1),
        }),
      )
      .min(1),
    headerCtas: z.array(linkCtaSchema).min(1),
    hireLinks: z.array(navHireLinkSchema).min(1),
  }),
});

const siteFooter = defineCollection({
  loader: glob({ pattern: 'footer.json', base: './src/content/site' }),
  schema: z.object({
    copyrightOwnerName: z.string().min(1),
    copyrightSuffix: z.string().min(1),
    showSocialLinks: z.boolean(),
    siteHeading: z.string().min(1),
    hireHeading: z.string().min(1),
    privacyLink: linkCtaSchema,
  }),
});

const siteSettings = defineCollection({
  loader: glob({ pattern: 'settings.json', base: './src/content/site' }),
  schema: z.object({
    siteTitle: z.string().min(1),
    siteDescription: z.string().min(1),
    siteUrl: z.string().min(1),
    keywords: z.array(z.string().min(1)).min(1),
    author: z.object({
      name: z.string().min(1),
      email: z.string().min(1),
      url: z.string().min(1),
      bio: z.string().min(1),
      jobTitle: z.string().min(1),
      location: z.string().min(1),
      address: z.object({
        locality: z.string().min(1),
        region: z.string().min(1),
        country: z.string().min(1),
      }),
      knowsAbout: z.array(z.string().min(1)).min(1),
      socialLinks: z
        .array(
          z.object({
            platform: z.string().min(1),
            label: z.string().min(1),
            url: z.string().min(1),
            ariaLabel: z.string().min(1),
          }),
        )
        .min(1),
    }),
    contact: z.object({
      email: z.string().min(1),
      phone: z.string().min(1),
      address: z.string().min(1),
    }),
    analytics: z.object({
      umamiScriptSrc: z.string().min(1),
      umamiWebsiteId: z.string().min(1),
    }),
  }),
});

export const collections = {
  blog,
  legal,
  // entity model:
  technologies,
  organizations,
  roles,
  projects,
  profile,
  // resume-adjacent:
  testimonials,
  // local development tools:
  emailSignatureProfiles,
  // site singletons:
  siteHomepage,
  siteHire,
  sitePages,
  siteCta,
  siteFooter,
  siteNavigation,
  siteSettings,
};
