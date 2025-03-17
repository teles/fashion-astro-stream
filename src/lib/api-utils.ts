
import { WpPost } from '@/types';
import { getExcerpt } from './utils';

/**
 * Gets the post image URL based on the requested size
 */
export function getPostImage(post: WpPost, size: 'thumbnail' | 'medium' | 'large' | 'full' = 'large'): string {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  
  if (!media) {
    return '/placeholder.svg';
  }
  
  if (size === 'full') {
    return media.source_url;
  }
  
  const sizes = media.media_details?.sizes;
  
  if (size === 'large' && sizes?.large) {
    return sizes.large.source_url;
  }
  
  if ((size === 'medium' || size === 'large') && sizes?.medium_large) {
    return sizes.medium_large.source_url;
  }
  
  return media.source_url;
}

/**
 * Extracts the excerpt from a post
 */
export function getPostExcerpt(post: WpPost, length: number = 160): string {
  return getExcerpt(post.excerpt.rendered, length);
}

/**
 * Generate pagination links based on current page and total pages
 */
export function generatePaginationLinks(currentPage: number, totalPages: number): (number | string)[] {
  const pages = [];
  const maxVisiblePages = 5;
  
  if (totalPages <= maxVisiblePages) {
    // Show all pages if total is less than maxVisiblePages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first and last, and some pages around current
    pages.push(1);
    
    if (currentPage > 3) {
      pages.push('ellipsis-start');
    }
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 2) {
      pages.push('ellipsis-end');
    }
    
    pages.push(totalPages);
  }
  
  return pages;
}
