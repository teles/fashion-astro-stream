
import { WpPost, WpCategory, WpTag, PaginationInfo } from '../types';

const API_URL = 'https://seamodapega.com.br/wp-json/wp/v2';

interface FetchPostsOptions {
  page?: number;
  perPage?: number;
  categories?: number[];
  search?: string;
  slug?: string;
}

export async function fetchPosts({
  page = 1,
  perPage = 9,
  categories,
  search,
  slug,
}: FetchPostsOptions = {}): Promise<{ posts: WpPost[], pagination: PaginationInfo }> {
  let url = `${API_URL}/posts?_embed&page=${page}&per_page=${perPage}`;
  
  if (categories && categories.length > 0) {
    url += `&categories=${categories.join(',')}`;
  }
  
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  
  if (slug) {
    url += `&slug=${encodeURIComponent(slug)}`;
  }
  
  try {
    const response = await fetch(url);
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);
    const totalPosts = parseInt(response.headers.get('X-WP-Total') || '0', 10);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const posts = await response.json();
    return { 
      posts, 
      pagination: {
        totalPages,
        totalPosts,
        currentPage: page
      }
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], pagination: { totalPages: 0, totalPosts: 0, currentPage: page } };
  }
}

export async function fetchSinglePost(slug: string): Promise<WpPost | null> {
  try {
    const { posts } = await fetchPosts({ slug, perPage: 1 });
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error('Error fetching single post:', error);
    return null;
  }
}

export async function fetchCategories(): Promise<WpCategory[]> {
  try {
    const response = await fetch(`${API_URL}/categories?per_page=100`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchCategory(id: number): Promise<WpCategory | null> {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    return null;
  }
}

export async function fetchCategoryBySlug(slug: string): Promise<WpCategory | null> {
  try {
    const response = await fetch(`${API_URL}/categories?slug=${encodeURIComponent(slug)}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    
    const categories = await response.json();
    return categories.length > 0 ? categories[0] : null;
  } catch (error) {
    console.error(`Error fetching category by slug ${slug}:`, error);
    return null;
  }
}

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

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function stripHtmlTags(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

export function getExcerpt(post: WpPost, length: number = 160): string {
  const rawExcerpt = stripHtmlTags(post.excerpt.rendered);
  
  if (rawExcerpt.length <= length) {
    return rawExcerpt;
  }
  
  return rawExcerpt.substring(0, length).trim() + '...';
}
