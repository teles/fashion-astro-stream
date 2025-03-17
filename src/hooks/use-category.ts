
import { useQuery } from '@tanstack/react-query';
import { wpApiService } from '@/services/wp-api-service';

export function useCategory(id: number) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => wpApiService.fetchCategory(id),
    enabled: Boolean(id),
  });
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: ['category', 'slug', slug],
    queryFn: () => wpApiService.fetchCategoryBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => wpApiService.fetchCategories(),
    select: (categories) => categories.filter(cat => cat.count && cat.count > 0),
  });
}

export function useCategoryPosts(categoryId: number | undefined, page = 1, perPage = 9) {
  return useQuery({
    queryKey: ['posts', 'category', categoryId, page],
    queryFn: () => wpApiService.fetchPosts({
      categories: categoryId ? [categoryId] : undefined,
      page,
      perPage
    }),
    enabled: Boolean(categoryId),
  });
}
