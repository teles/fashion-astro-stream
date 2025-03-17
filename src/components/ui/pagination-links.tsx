
import { PaginationItem, PaginationLink, PaginationEllipsis } from '@/components/ui/pagination';
import { generatePaginationLinks } from '@/lib/api-utils';

interface PaginationLinksProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationLinks({ currentPage, totalPages, onPageChange }: PaginationLinksProps) {
  const pages = generatePaginationLinks(currentPage, totalPages);
  
  return (
    <>
      {pages.map((page, i) => (
        typeof page === 'number' ? (
          <PaginationItem key={`page-${page}`}>
            <PaginationLink 
              isActive={page === currentPage}
              onClick={() => onPageChange(page)}
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
    </>
  );
}
