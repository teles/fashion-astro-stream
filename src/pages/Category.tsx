
import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCategoryBySlug, fetchPosts } from '../services/api';
import PostCard from '../components/PostCard';
import { Button } from '@/components/ui/button';

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  
  const { data: category } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => fetchCategoryBySlug(slug || ''),
  });
  
  const { data: postsData } = useQuery({
    queryKey: ['posts', 'category', category?.id, currentPage],
    queryFn: () => fetchPosts({
      categories: category ? [category.id] : undefined,
      page: currentPage,
      perPage: 9
    }),
    enabled: !!category,
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);
  
  if (!category) {
    return (
      <div className="page-container text-center">
        <h1 className="mb-4">Categoria não encontrada</h1>
        <p className="text-fashion-secondary">A categoria que você está procurando não existe ou foi removida.</p>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen">
      <div className="page-container">
        <header className="text-center mb-12">
          <h1 className="mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-fashion-secondary max-w-2xl mx-auto">{category.description}</p>
          )}
        </header>
        
        {postsData?.posts.length === 0 ? (
          <div className="text-center">
            <p className="text-fashion-secondary">Nenhum post encontrado nesta categoria.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {postsData?.posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            
            {postsData?.pagination && postsData.pagination.totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setSearchParams({ page: String(currentPage - 1) })}
                  disabled={currentPage <= 1}
                >
                  Anterior
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setSearchParams({ page: String(currentPage + 1) })}
                  disabled={currentPage >= postsData.pagination.totalPages}
                >
                  Próxima
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Category;
