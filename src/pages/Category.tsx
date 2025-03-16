
import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCategoryBySlug, fetchPosts } from '../services/api';
import PostCard from '../components/PostCard';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => fetchCategoryBySlug(slug || ''),
  });
  
  const { data: postsData, isLoading: postsLoading } = useQuery({
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
  
  if (categoryLoading) {
    return (
      <div className="page-container">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-fashion-lightGray rounded w-3/4 mx-auto" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <div className="h-48 bg-fashion-lightGray rounded" />
                <div className="h-4 bg-fashion-lightGray rounded w-3/4" />
                <div className="h-4 bg-fashion-lightGray rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!category) {
    return (
      <div className="page-container text-center">
        <h1 className="mb-4">Categoria não encontrada</h1>
        <p className="text-fashion-secondary">A categoria que você está procurando não existe ou foi removida.</p>
      </div>
    );
  }
  
  // Function to decode HTML entities
  const decodeHtmlEntities = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  };
  
  const decodedCategoryName = decodeHtmlEntities(category.name);
  const totalPages = postsData?.pagination?.totalPages || 0;
  
  // Generate an array of page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include page 1
      pageNumbers.push(1);
      
      // Calculate start and end of the middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust to show maxPagesToShow - 2 pages (minus first and last)
      if (endPage - startPage < maxPagesToShow - 3) {
        if (currentPage < totalPages / 2) {
          endPage = Math.min(startPage + maxPagesToShow - 3, totalPages - 1);
        } else {
          startPage = Math.max(endPage - (maxPagesToShow - 3), 2);
        }
      }
      
      // Add ellipsis after page 1 if needed
      if (startPage > 2) {
        pageNumbers.push('ellipsis-start');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('ellipsis-end');
      }
      
      // Always include last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  return (
    <main className="min-h-screen">
      <div className="page-container">
        <header className="text-center mb-12">
          <h1 className="mb-4">{decodedCategoryName}</h1>
          {category.description && (
            <p className="text-fashion-secondary max-w-2xl mx-auto">{category.description}</p>
          )}
        </header>
        
        {postsLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3 animate-pulse">
                <div className="h-48 bg-fashion-lightGray rounded" />
                <div className="h-4 bg-fashion-lightGray rounded w-3/4" />
                <div className="h-4 bg-fashion-lightGray rounded" />
              </div>
            ))}
          </div>
        ) : postsData?.posts.length === 0 ? (
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
              <Pagination className="mt-12">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) {
                          setSearchParams({ page: String(currentPage - 1) });
                        }
                      }}
                      aria-disabled={currentPage <= 1}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {getPageNumbers().map((page, i) => (
                    typeof page === 'number' ? (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setSearchParams({ page: String(page) });
                          }}
                          isActive={currentPage === page}
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
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) {
                          setSearchParams({ page: String(currentPage + 1) });
                        }
                      }}
                      aria-disabled={currentPage >= totalPages}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Category;
