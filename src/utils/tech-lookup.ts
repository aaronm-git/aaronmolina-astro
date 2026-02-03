import type { CollectionEntry } from 'astro:content';

/**
 * Technology lookup utilities for resolving technology slugs to display names
 */

export type TechMap = Map<string, string>;

/**
 * Create a technology lookup map from a collection of technologies
 * @param technologies - Array of technology collection entries
 * @returns Map of slug to display name
 */
export function createTechMap(
  technologies: CollectionEntry<'technologies'>[]
): TechMap {
  return new Map(technologies.map(t => [t.data.slug, t.data.name]));
}

/**
 * Get technology display name from slug
 * Falls back to the slug if not found in the map
 * @param slug - Technology slug
 * @param techMap - Technology lookup map
 * @returns Display name or slug as fallback
 */
export function getTechName(slug: string, techMap: TechMap): string {
  return techMap.get(slug) || slug;
}

/**
 * Get multiple technology display names
 * @param slugs - Array of technology slugs
 * @param techMap - Technology lookup map
 * @returns Array of display names
 */
export function getTechNames(slugs: string[], techMap: TechMap): string[] {
  return slugs.map(slug => getTechName(slug, techMap));
}

/**
 * Convert TechMap to a plain object (useful for passing as props)
 * @param techMap - Technology lookup map
 * @returns Plain object with slug keys and name values
 */
export function techMapToObject(techMap: TechMap): Record<string, string> {
  return Object.fromEntries(techMap);
}

/**
 * Create TechMap from a plain object
 * @param obj - Plain object with slug keys and name values
 * @returns Technology lookup map
 */
export function objectToTechMap(obj: Record<string, string>): TechMap {
  return new Map(Object.entries(obj));
}
