
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Decodes HTML entities from a string
 */
export function decodeHtmlEntities(text: string): string {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

/**
 * Strips HTML tags from a string
 */
export function stripHtmlTags(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

/**
 * Formats a date string according to the Brazilian locale
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Creates a excerpt from post content
 */
export function getExcerpt(content: string, length: number = 160): string {
  const rawExcerpt = stripHtmlTags(content);
  
  if (rawExcerpt.length <= length) {
    return rawExcerpt;
  }
  
  return rawExcerpt.substring(0, length).trim() + '...';
}
