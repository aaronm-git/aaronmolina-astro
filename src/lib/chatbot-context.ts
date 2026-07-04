import { getCollection, type CollectionEntry } from 'astro:content';
import homepageContent from '@/content/site/homepage.json';
import siteSettings from '@/content/site/settings.json';

const SITE = siteSettings.siteUrl.replace(/\/$/, '');

/**
 * Source labels prepended to every fact in the chatbot context so the model can
 * attribute each answer to the collection it came from.
 */
export type ChatbotSourceLabel = 'Profile' | 'Service' | 'Project' | 'Experience' | 'Skill' | 'Testimonial';

const formatDate = (d?: Date | null): string => {
  if (!d) return 'present';
  return d.toISOString().slice(0, 10);
};

const yearsOfExperience = (): number => new Date().getFullYear() - homepageContent.yearsOfExperienceStartYear;

/** Interpolates the `{yearsOfExperience}` placeholder used across site content. */
const withYears = (text: string): string => text.replaceAll('{yearsOfExperience}', String(yearsOfExperience()));

/**
 * Loads the single profile entry, if present. The profile collection is expected
 * to hold exactly one document, so we read the first entry.
 */
async function getProfile(): Promise<CollectionEntry<'profile'>['data'] | null> {
  const entries = await getCollection('profile');
  return entries[0]?.data ?? null;
}

/** Chatbot-eligible services, ordered for presentation. */
export async function getChatbotServices(): Promise<CollectionEntry<'services'>[]> {
  return (await getCollection('services'))
    .filter(s => s.data.isActive !== false && s.data.includeInChatbot !== false)
    .sort((a, b) => (a.data.sortOrder ?? 0) - (b.data.sortOrder ?? 0) || a.data.title.localeCompare(b.data.title));
}

/** Chatbot-eligible projects, featured first then most recently completed. */
async function getChatbotProjects(): Promise<CollectionEntry<'projects'>[]> {
  return (await getCollection('projects'))
    .filter(p => p.data.isActive !== false && p.data.includeInChatbot !== false)
    .sort((a, b) => {
      if (a.data.featured && !b.data.featured) return -1;
      if (!a.data.featured && b.data.featured) return 1;
      if ((a.data.sortOrder ?? 0) !== (b.data.sortOrder ?? 0)) return (a.data.sortOrder ?? 0) - (b.data.sortOrder ?? 0);
      return (b.data.completedOn?.getTime() || 0) - (a.data.completedOn?.getTime() || 0);
    });
}

/** Chatbot-eligible roles, current first then most recent. */
async function getChatbotRoles(): Promise<CollectionEntry<'roles'>[]> {
  return (await getCollection('roles'))
    .filter(r => r.data.isActive !== false && r.data.includeInChatbot !== false)
    .sort((a, b) => {
      if (a.data.current && !b.data.current) return -1;
      if (!a.data.current && b.data.current) return 1;
      return b.data.startDate.getTime() - a.data.startDate.getTime();
    });
}

/** Chatbot-eligible skills: featured technologies at expert or near-expert level. */
async function getChatbotSkills(): Promise<CollectionEntry<'technologies'>[]> {
  return (await getCollection('technologies'))
    .filter(t => t.data.includeInChatbot !== false && t.data.featured && (t.data.level ?? 0) >= 8)
    .sort((a, b) => (b.data.level ?? 0) - (a.data.level ?? 0) || a.data.name.localeCompare(b.data.name));
}

/** Chatbot-eligible testimonials, featured first. */
async function getChatbotTestimonials(): Promise<CollectionEntry<'testimonials'>[]> {
  return (await getCollection('testimonials'))
    .filter(t => t.data.isActive !== false && t.data.includeInChatbot !== false)
    .sort((a, b) => {
      if (a.data.featured && !b.data.featured) return -1;
      if (!a.data.featured && b.data.featured) return 1;
      return (a.data.sortOrder ?? 0) - (b.data.sortOrder ?? 0);
    });
}

/**
 * Renders a "## Services" markdown section from the services collection, with a
 * `Service:` source label on every line. Reused by both the chatbot context and
 * the public `/llms.txt` knowledge base so services have a single source of truth.
 */
export function renderServicesSection(services: CollectionEntry<'services'>[]): string {
  const lines = services
    .map(s => {
      const summary = s.data.chatbotSummary ?? s.data.summary;
      const tech = s.data.technologies.length > 0 ? ` Technologies: ${s.data.technologies.join(', ')}.` : '';
      return `- Service: ${s.data.title} - ${summary}${tech}`;
    })
    .join('\n');
  return lines;
}

/**
 * Builds the AI chatbot knowledge base entirely from content collections. Every
 * fact carries a source label (Profile, Service, Project, Experience, Skill,
 * Testimonial) so the assistant can only answer from this grounded content and
 * never invent details. Reused by the `/chat-context.txt` endpoint that the chat
 * function fetches at runtime.
 */
export async function buildChatbotContext(): Promise<string> {
  const [profile, services, projects, roles, skills, testimonials] = await Promise.all([
    getProfile(),
    getChatbotServices(),
    getChatbotProjects(),
    getChatbotRoles(),
    getChatbotSkills(),
    getChatbotTestimonials(),
  ]);

  const organizations = await getCollection('organizations');
  const orgBySlug = new Map(organizations.map(o => [o.data.slug, o.data]));

  const profileLines: string[] = [];
  if (profile) {
    profileLines.push(`- Profile: ${profile.fullName}, ${profile.headline}.`);
    const summary = withYears(profile.chatbotSummary ?? profile.summary);
    profileLines.push(`- Profile: ${summary}`);
    if (profile.location) profileLines.push(`- Profile: Based in ${profile.location}. Open to remote work across the US.`);
    if (profile.availability) {
      const availabilityText: Record<string, string> = {
        open_to_work: 'Currently open to work.',
        available_for_contract: 'Available for contract engagements.',
        not_available: 'Not currently available for new work.',
      };
      profileLines.push(`- Profile: ${availabilityText[profile.availability] ?? profile.availability}`);
    }
    if (profile.specialties.length > 0) {
      profileLines.push(`- Profile: Specialties: ${profile.specialties.join(', ')}.`);
    }
  }

  const serviceLines = renderServicesSection(services);

  const projectLines = projects
    .map(p => {
      const summary = p.data.chatbotSummary ?? p.data.summary ?? '';
      const summaryText = summary ? ` - ${summary}` : '';
      const completed = p.data.completedOn ? ` (completed ${formatDate(p.data.completedOn)})` : '';
      const tech = p.data.technologies.length > 0 ? ` Technologies: ${p.data.technologies.join(', ')}.` : '';
      const live = p.data.liveUrl ? ` Live: ${p.data.liveUrl}.` : '';
      const link = ` More: ${SITE}/projects/${p.data.slug}.`;
      return `- Project: ${p.data.title}${summaryText}${completed}.${tech}${live}${link}`;
    })
    .join('\n');

  const roleLines = roles
    .map(r => {
      const org = orgBySlug.get(r.data.organization);
      const orgName = org?.name ?? r.data.organization;
      const location = r.data.location ? ` (${r.data.location})` : '';
      const start = formatDate(r.data.startDate);
      const end = r.data.current ? 'present' : formatDate(r.data.endDate);
      const summary = r.data.chatbotSummary ?? r.data.summary;
      const summaryText = summary ? ` ${summary}` : '';
      const techs = r.data.technologies.length > 0 ? ` Skills: ${r.data.technologies.join(', ')}.` : '';
      return `- Experience: ${orgName} - ${r.data.title}${location}, ${start} to ${end}.${summaryText}${techs}`;
    })
    .join('\n');

  const skillLines = skills.map(t => `- Skill: ${t.data.name}${t.data.level ? ` (level ${t.data.level}/10)` : ''}`).join('\n');

  const testimonialLines = testimonials
    .map(t => {
      const attribution = [t.data.name, t.data.role, t.data.organization].filter(Boolean).join(', ');
      return `- Testimonial: "${t.data.quote}" - ${attribution}`;
    })
    .join('\n');

  const social = siteSettings.author.socialLinks.map(s => `- ${s.label}: ${s.url}`).join('\n');

  const sections: string[] = [
    `# Aaron Molina - Portfolio Knowledge Base

This is the authoritative, source-of-truth knowledge base for aaronmolina.me,
generated from the site's content collections. Every fact below is labeled with
its source (Profile, Service, Project, Experience, Skill, Testimonial). Answer
only from this content. If a question is not covered here, say the information is
not available and offer to forward it to Aaron. Do not invent experience, dates,
clients, skills, rates, or project details.`,
  ];

  if (profileLines.length > 0) sections.push(`## Profile\n${profileLines.join('\n')}`);
  if (serviceLines) sections.push(`## Services\n${serviceLines}`);
  if (projectLines) sections.push(`## Projects\n${projectLines}`);
  if (roleLines) sections.push(`## Experience\n${roleLines}`);
  if (skillLines) sections.push(`## Skills (expert and near-expert level)\n${skillLines}`);
  if (testimonialLines) sections.push(`## Testimonials\n${testimonialLines}`);

  sections.push(`## Contact
- Contact page: ${SITE}/contact
- Email: ${siteSettings.contact.email}
${social}`);

  return sections.join('\n\n') + '\n';
}
