export interface WpPost {
  id: number;
  date: string;
  modified: string; // Add modified date property
  slug: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text?: string;
      media_details?: {
        sizes?: {
          medium_large?: {
            source_url: string;
          };
          large?: {
            source_url: string;
          };
        };
      };
    }>;
    'wp:term'?: Array<Array<WpTerm>>;
    'author'?: Array<{
      name: string;
    }>;
  };
  categories: number[];
  tags: number[];
}

export interface WpTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: 'category' | 'post_tag';
  description?: string;
  count?: number;
}

export interface WpCategory extends WpTerm {
  taxonomy: 'category';
}

export interface WpTag extends WpTerm {
  taxonomy: 'post_tag';
}

export interface PaginationInfo {
  totalPages: number;
  totalPosts: number;
  currentPage: number;
}
