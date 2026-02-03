/**
 * Breadcrumb utilities for generating breadcrumb trails from URL paths
 */

export interface BreadcrumbItem {
  label: string;
  href: string;
}

/**
 * Generate breadcrumb items from a URL pathname
 * Always includes home as the first item
 */
export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // Don't show breadcrumbs on homepage
  if (pathname === '/') {
    return [];
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' }
  ];

  // Split the pathname and create breadcrumb items
  const segments = pathname.split('/').filter(Boolean);
  let href = '';

  const labelMap: Record<string, string> = {
    hire: 'Services',
    projects: 'Projects',
    experience: 'Experience',
    blog: 'Blog',
    contact: 'Contact',
    'react-developer': 'React Developer',
    'nextjs-developer': 'Next.js Developer',
    'headless-cms': 'Headless CMS',
    tag: 'Tag',
  };

  segments.forEach((segment, index) => {
    href += `/${segment}`;

    // Get readable label
    const label = labelMap[segment] || formatSegment(segment);

    breadcrumbs.push({
      label,
      href
    });
  });

  return breadcrumbs;
}

/**
 * Format a URL segment into a readable label
 * Handles slugs by converting kebab-case to Title Case
 */
function formatSegment(segment: string): string {
  return segment
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Create a breadcrumb item with custom label
 * Useful for dynamic pages where you want to override the auto-generated label
 */
export function createBreadcrumbItem(label: string, href: string): BreadcrumbItem {
  return { label, href };
}
