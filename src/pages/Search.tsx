
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSearchPosts } from '@/hooks/use-search';
import { WpPost } from '../types';
import PostCard from '../components/PostCard';
import { Card } from '@/components/ui/card';
import { Search as SearchIcon } from 'lucide-react';
import SEO from '@/components/SEO';
import { decodeHtmlEntities } from '@/lib/utils';

const Search = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const { data, isLoading, error } = useSearchPosts(searchQuery, 12);
  
  const posts = data?.posts || [];
  const totalPosts = data?.pagination?.totalPosts || 0;
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searchQuery]);
  
  const decodedSearchQuery = decodeHtmlEntities(searchQuery);
  
  return (
    <>
      <SEO 
        title={`Resultados para "${decodedSearchQuery}"`}
        description={`Encontre conteúdo relevante sobre "${decodedSearchQuery}" no blog Se A Moda Pega. ${totalPosts} resultados encontrados.`}
      />
      
      <main className="min-h-screen">
        <section className="page-container max-w-6xl">
          <header className="text-center mb-8 md:mb-12">
            <h1 className="mb-4">Resultados para "{decodedSearchQuery}"</h1>
            {!isLoading && (
              <p className="text-fashion-secondary">
                {totalPosts} {totalPosts === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </p>
            )}
          </header>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="aspect-[4/3] bg-fashion-lightGray"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-fashion-lightGray rounded w-1/4"></div>
                    <div className="h-6 bg-fashion-lightGray rounded w-3/4"></div>
                    <div className="h-4 bg-fashion-lightGray rounded"></div>
                    <div className="h-4 bg-fashion-lightGray rounded w-1/4"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <SearchIcon size={48} className="mx-auto mb-4 text-fashion-secondary opacity-50" aria-hidden="true" />
              <h2 className="mb-2">Nenhum resultado encontrado</h2>
              <p className="text-fashion-secondary max-w-lg mx-auto">
                Não encontramos nenhum post correspondente à sua busca. Tente termos diferentes ou navegue pelas categorias.
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Search;
