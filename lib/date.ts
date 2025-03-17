import {
  format,
  formatRelative,
  formatDistance,
  isAfter,
  parseISO,
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
} from 'date-fns';

/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Jan 1, 2023")
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';

  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Format a date string to include time
 * @param dateString - ISO date string
 * @returns Formatted date and time string (e.g., "Jan 1, 2023, 2:00 PM")
 */
export function formatDateTime(dateString: string): string {
  if (!dateString) return '';

  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy, h:mm a');
  } catch (error) {
    console.error('Error formatting date time:', error);
    return '';
  }
}

/**
 * Check if a date is in the future
 * @param dateString - ISO date string
 * @returns Boolean indicating if the date is in the future
 */
export function isDateInFuture(dateString: string): boolean {
  if (!dateString) return false;

  try {
    const date = parseISO(dateString);
    return isAfter(date, new Date());
  } catch (error) {
    console.error('Error checking if date is in future:', error);
    return false;
  }
}

/**
 * Get a relative time string (e.g., "2 days ago", "in 3 months")
 * @param dateString - ISO date string
 * @returns Relative time string
 */
export function getRelativeTimeString(dateString: string): string {
  if (!dateString) return '';

  try {
    const date = parseISO(dateString);
    return formatDistance(date, new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Error getting relative time string:', error);
    return '';
  }
}

/**
 * Formats a date relative to the current date (e.g., "yesterday", "last Friday")
 */
export function getRelativeDate(dateString: string): string {
  if (!dateString) return '';

  try {
    const date = parseISO(dateString);
    return formatRelative(date, new Date());
  } catch (error) {
    console.error('Error getting relative date:', error);
    return '';
  }
}

/**
 * Formats a date with a custom format string
 */
export function formatCustom(dateString: string, formatString: string): string {
  if (!dateString) return '';

  try {
    const date = parseISO(dateString);
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date with custom format:', error);
    return '';
  }
}

/**
 * Gets the time difference between a date and now in the most appropriate unit
 */
export function getTimeDifference(dateString: string): {
  value: number;
  unit: string;
} {
  if (!dateString) return { value: 0, unit: 'seconds' };

  try {
    const date = parseISO(dateString);
    const now = new Date();

    const seconds = Math.abs(differenceInSeconds(date, now));
    if (seconds < 60) return { value: seconds, unit: 'seconds' };

    const minutes = Math.abs(differenceInMinutes(date, now));
    if (minutes < 60) return { value: minutes, unit: 'minutes' };

    const hours = Math.abs(differenceInHours(date, now));
    if (hours < 24) return { value: hours, unit: 'hours' };

    const days = Math.abs(differenceInDays(date, now));
    if (days < 7) return { value: days, unit: 'days' };

    const weeks = Math.abs(differenceInWeeks(date, now));
    if (weeks < 4) return { value: weeks, unit: 'weeks' };

    const months = Math.abs(differenceInMonths(date, now));
    if (months < 12) return { value: months, unit: 'months' };

    const years = Math.abs(differenceInYears(date, now));
    return { value: years, unit: 'years' };
  } catch (error) {
    console.error('Error getting time difference:', error);
    return { value: 0, unit: 'seconds' };
  }
}
