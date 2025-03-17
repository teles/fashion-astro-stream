
import { useQuery } from '@tanstack/react-query';
import { wpApiService } from '@/services/wp-api-service';

export function useSearchPosts(searchQuery: string, perPage = 12) {
  return useQuery({
    queryKey: ['posts', 'search', searchQuery],
    queryFn: () => wpApiService.fetchPosts({ search: searchQuery, perPage }),
    enabled: searchQuery.length > 0,
  });
}
