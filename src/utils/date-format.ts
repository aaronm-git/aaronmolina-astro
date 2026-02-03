/**
 * Date formatting utilities for consistent date display across the site
 */

export type DateFormat = 'short' | 'long' | 'month-year' | 'full';

const formatOptions: Record<DateFormat, Intl.DateTimeFormatOptions> = {
  short: { year: 'numeric', month: 'short' },
  long: { year: 'numeric', month: 'long', day: 'numeric' },
  'month-year': { year: 'numeric', month: 'long' },
  full: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
};

/**
 * Format a date with consistent styling
 * @param date - Date to format
 * @param format - Format style (short, long, month-year, full)
 * @param locale - Locale for formatting (default: en-US)
 * @returns Formatted date string
 */
export function formatDate(
  date: Date,
  format: DateFormat = 'long',
  locale: string = 'en-US'
): string {
  return date.toLocaleDateString(locale, formatOptions[format]);
}

/**
 * Format a date range (e.g., "Jan 2020 - Mar 2023" or "Jan 2020 - Present")
 * @param startDate - Start date
 * @param endDate - End date (optional)
 * @param isCurrent - Whether this is a current/ongoing period
 * @param locale - Locale for formatting
 * @returns Formatted date range string
 */
export function formatDateRange(
  startDate: Date,
  endDate?: Date,
  isCurrent: boolean = false,
  locale: string = 'en-US'
): string {
  const start = formatDate(startDate, 'short', locale);

  if (isCurrent) {
    return `${start} - Present`;
  }

  if (endDate) {
    const end = formatDate(endDate, 'short', locale);
    return `${start} - ${end}`;
  }

  return start;
}

/**
 * Calculate and format duration between two dates
 * @param startDate - Start date
 * @param endDate - End date (defaults to now)
 * @returns Human-readable duration string (e.g., "2 years, 3 months")
 */
export function calculateDuration(startDate: Date, endDate?: Date): string {
  const end = endDate || new Date();
  const start = startDate;

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  }
  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  }

  return parts.length > 0 ? parts.join(', ') : '1 month';
}

/**
 * Get relative time description (e.g., "2 days ago", "in 3 months")
 * @param date - Date to compare
 * @param locale - Locale for formatting
 * @returns Relative time string
 */
export function getRelativeTime(date: Date, locale: string = 'en-US'): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  if (Math.abs(diffInDays) < 1) {
    return 'today';
  } else if (Math.abs(diffInDays) < 7) {
    return rtf.format(diffInDays, 'day');
  } else if (Math.abs(diffInDays) < 30) {
    return rtf.format(Math.round(diffInDays / 7), 'week');
  } else if (Math.abs(diffInDays) < 365) {
    return rtf.format(Math.round(diffInDays / 30), 'month');
  } else {
    return rtf.format(Math.round(diffInDays / 365), 'year');
  }
}

/**
 * Get ISO date string for datetime attributes
 * @param date - Date to format
 * @returns ISO date string
 */
export function toISODateString(date: Date): string {
  return date.toISOString();
}
