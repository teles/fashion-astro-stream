
import { ApiService, FetchPostsOptions, FetchPostsResult } from './api-interface';
import { WpPost, WpCategory, PaginationInfo } from '@/types';

export class WordPressApiService implements ApiService {
  private API_URL: string;

  constructor(apiUrl: string = 'https://seamodapega.com.br/wp-json/wp/v2') {
    this.API_URL = apiUrl;
  }

  async fetchPosts(options: FetchPostsOptions = {}): Promise<FetchPostsResult> {
    const { page = 1, perPage = 9, categories, search, slug } = options;
    
    let url = `${this.API_URL}/posts?_embed&page=${page}&per_page=${perPage}`;
    
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
      return { 
        posts: [], 
        pagination: { 
          totalPages: 0, 
          totalPosts: 0, 
          currentPage: page 
        } 
      };
    }
  }

  async fetchSinglePost(slug: string): Promise<WpPost | null> {
    try {
      const { posts } = await this.fetchPosts({ slug, perPage: 1 });
      return posts.length > 0 ? posts[0] : null;
    } catch (error) {
      console.error('Error fetching single post:', error);
      return null;
    }
  }

  async fetchCategories(): Promise<WpCategory[]> {
    try {
      const response = await fetch(`${this.API_URL}/categories?per_page=100`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async fetchCategory(id: number): Promise<WpCategory | null> {
    try {
      const response = await fetch(`${this.API_URL}/categories/${id}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      return null;
    }
  }

  async fetchCategoryBySlug(slug: string): Promise<WpCategory | null> {
    try {
      const response = await fetch(`${this.API_URL}/categories?slug=${encodeURIComponent(slug)}`);
      
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
}

// Create a singleton instance to use throughout the app
export const wpApiService = new WordPressApiService();
