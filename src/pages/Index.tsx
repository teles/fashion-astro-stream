
import { useEffect, useState } from 'react';
import { useFeaturedPost, useRecentPosts } from '../hooks/use-post';
import FeaturedPost from '../components/FeaturedPost';
import PostCard from '../components/PostCard';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Loader2 } from 'lucide-react';
import { PaginationLinks } from '@/components/ui/pagination-links';

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const { data: featuredPost } = useFeaturedPost();
  const { posts: recentPosts, pagination, isLoading } = useRecentPosts(
    currentPage, 
    postsPerPage, 
    featuredPost?.id
  );
  
  const totalPages = pagination.totalPages || 1;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="min-h-screen flex flex-col">
      {featuredPost && (
        <FeaturedPost post={featuredPost} />
      )}
      
      <section className="page-container">
        <h2 className="text-center mb-8">Últimos Posts</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-fashion-primary/50" />
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {recentPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-10">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    <PaginationLinks 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

export default Index;
