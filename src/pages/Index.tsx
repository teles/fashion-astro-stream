
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../services/api';
import { WpPost } from '../types';
import FeaturedPost from '../components/FeaturedPost';
import PostCard from '../components/PostCard';
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const { data: featuredData } = useQuery({
    queryKey: ['posts', 'featured'],
    queryFn: () => fetchPosts({ perPage: 1 }),
  });

  const { data: recentData, isLoading } = useQuery({
    queryKey: ['posts', 'recent', currentPage],
    queryFn: () => fetchPosts({ perPage: postsPerPage, page: currentPage }),
  });

  const featuredPost = featuredData?.posts[0];
  const recentPosts = recentData?.posts.filter(post => post.id !== featuredPost?.id) || [];
  const totalPages = recentData?.pagination.totalPages || 1;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Generate pagination links
  const generatePaginationLinks = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first and last, and some pages around current
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('ellipsis-start');
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis-end');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };
  
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
                    
                    {generatePaginationLinks().map((page, i) => (
                      typeof page === 'number' ? (
                        <PaginationItem key={`page-${page}`}>
                          <PaginationLink 
                            isActive={page === currentPage}
                            onClick={() => handlePageChange(page)}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={`ellipsis-${i}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    ))}
                    
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
