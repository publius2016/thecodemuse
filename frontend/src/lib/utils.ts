import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get full URL for Strapi media
export function getStrapiMediaUrl(url: string | undefined): string {
  if (!url) return '';
  
  // If it's already a full URL, return as is
  if (url.startsWith('http')) {
    return url;
  }
  
  // Otherwise, prepend the Strapi URL
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  return `${strapiUrl}${url}`;
}

// Get optimized image URL with specific format
export function getOptimizedImageUrl(
  media: any,
  format: 'thumbnail' | 'small' | 'medium' | 'large' = 'medium'
): string {
  if (!media) return '';
  
  // Try to get the specific format
  if (media.formats && media.formats[format]) {
    return getStrapiMediaUrl(media.formats[format].url);
  }
  
  // Fallback to original image
  return getStrapiMediaUrl(media.url);
}

// Format date using date-fns
export function formatDate(date: string | Date, format: string = 'MMM dd, yyyy'): string {
  const { format: formatDate } = require('date-fns');
  return formatDate(new Date(date), format);
}

// Generate reading time estimate
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Slugify text for URLs
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Truncate text to specified length
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}

// Get excerpt from content
export function getExcerpt(content: string, maxLength: number = 160): string {
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, '');
  return truncateText(plainText, maxLength);
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
} 