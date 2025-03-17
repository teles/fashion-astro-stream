
import { useQuery } from '@tanstack/react-query';
import { wpApiService } from '@/services/wp-api-service';
import { WpPost } from '@/types';

export function usePost(slug: string) {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: () => wpApiService.fetchSinglePost(slug),
    enabled: Boolean(slug),
  });
}

export function usePosts(options = {}) {
  return useQuery({
    queryKey: ['posts', options],
    queryFn: () => wpApiService.fetchPosts(options),
  });
}

export function useFeaturedPost() {
  return useQuery({
    queryKey: ['posts', 'featured'],
    queryFn: () => wpApiService.fetchPosts({ perPage: 1 }),
    select: (data) => data.posts[0],
  });
}

export function useRecentPosts(page = 1, perPage = 6, excludePostId?: number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', 'recent', page, perPage],
    queryFn: () => wpApiService.fetchPosts({ page, perPage }),
  });

  const posts = data?.posts?.filter(post => post.id !== excludePostId) || [];
  const pagination = data?.pagination || { totalPages: 0, totalPosts: 0, currentPage: page };

  return { posts, pagination, isLoading, error };
}

export function useRelatedPosts(postCategories: number[] = [], excludePostId?: number) {
  const { data, isLoading } = useQuery({
    queryKey: ['posts', 'related', postCategories],
    queryFn: () => wpApiService.fetchPosts({ 
      categories: postCategories,
      perPage: 3
    }),
    enabled: postCategories.length > 0,
  });

  const posts = data?.posts?.filter(post => post.id !== excludePostId) || [];
  
  return { posts, isLoading };
}
