import { getEntry, type CollectionEntry } from 'astro:content';

type SiteCollection = 'siteHomepage' | 'siteHire' | 'sitePages' | 'siteCta' | 'siteFooter' | 'siteNavigation' | 'siteSettings';

/**
 * Loads a required singleton site-content entry and returns its narrowed data.
 * Throws when the entry is missing rather than injecting a fallback, so a
 * missing content file fails the build instead of rendering empty copy.
 */
export async function getSiteEntry<C extends SiteCollection>(collection: C, id: string): Promise<CollectionEntry<C>['data']> {
  const entry = await getEntry(collection, id);
  if (!entry) {
    throw new Error(`Missing required site content: ${collection}/${id}`);
  }
  return entry.data;
}
