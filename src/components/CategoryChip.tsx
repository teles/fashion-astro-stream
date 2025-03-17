
import { Link } from 'react-router-dom';
import { WpCategory } from '@/types';
import { decodeHtmlEntities } from '@/lib/utils';

interface CategoryChipProps {
  category: WpCategory;
  className?: string;
  onClick?: () => void;
}

const CategoryChip = ({ category, className = '', onClick }: CategoryChipProps) => {
  const decodedCategoryName = decodeHtmlEntities(category.name);
  const baseClasses = `inline-block px-3 py-1 text-xs font-medium rounded-full bg-fashion-primary/10 text-fashion-primary hover:bg-fashion-primary/20 transition-colors ${className}`;
  
  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className={baseClasses}
      >
        {decodedCategoryName}
      </button>
    );
  }
  
  return (
    <Link 
      to={`/categoria/${category.slug}`}
      className={baseClasses}
    >
      {decodedCategoryName}
    </Link>
  );
};

export default CategoryChip;
