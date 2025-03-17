
import { WpPost, WpCategory, WpTag, PaginationInfo } from '@/types';

export interface FetchPostsOptions {
  page?: number;
  perPage?: number;
  categories?: number[];
  search?: string;
  slug?: string;
}

export interface FetchPostsResult {
  posts: WpPost[];
  pagination: PaginationInfo;
}

export interface ApiService {
  fetchPosts(options?: FetchPostsOptions): Promise<FetchPostsResult>;
  fetchSinglePost(slug: string): Promise<WpPost | null>;
  fetchCategories(): Promise<WpCategory[]>;
  fetchCategory(id: number): Promise<WpCategory | null>;
  fetchCategoryBySlug(slug: string): Promise<WpCategory | null>;
}
