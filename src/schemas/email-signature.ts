import { z } from 'zod';

/**
 * Supported portfolio-oriented social networks.
 */
export const socialPlatformSchema = z.enum(['linkedin', 'github', 'twitter', 'instagram', 'facebook', 'youtube', 'bluesky', 'threads', 'mastodon', 'dribbble', 'behance']);

/**
 * Supported social-network identifier.
 */
export type SocialPlatform = z.infer<typeof socialPlatformSchema>;

/**
 * Select options shared by the server-rendered editor and its client behavior.
 */
export const socialPlatformOptions: Array<{ value: SocialPlatform; label: string }> = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'github', label: 'GitHub' },
  { value: 'twitter', label: 'X / Twitter' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'bluesky', label: 'Bluesky' },
  { value: 'threads', label: 'Threads' },
  { value: 'mastodon', label: 'Mastodon' },
  { value: 'dribbble', label: 'Dribbble' },
  { value: 'behance', label: 'Behance' },
];

/**
 * Validated social profile link.
 */
export const emailSignatureSocialSchema = z.object({
  platform: socialPlatformSchema,
  url: z.url(),
});

/**
 * Validated contact profile used to generate job-search email signatures.
 */
export const emailSignatureProfileSchema = z.object({
  fullName: z.string().min(1),
  title: z.string().min(1),
  specialization: z.string().min(1),
  email: z.email(),
  phone: z.string().min(1),
  location: z.string().min(1),
  website: z.url(),
  socials: z.array(emailSignatureSocialSchema).max(10),
  disclaimer: z.string().min(1),
});

/**
 * Contact profile type inferred from the shared Zod schema.
 */
export type EmailSignatureProfile = z.infer<typeof emailSignatureProfileSchema>;
