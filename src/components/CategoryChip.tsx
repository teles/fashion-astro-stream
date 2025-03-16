
import { Link } from 'react-router-dom';
import { WpCategory } from '../types';

// Function to decode HTML entities
const decodeHtmlEntities = (text: string) => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};

interface CategoryChipProps {
  category: WpCategory;
  className?: string;
  onClick?: () => void;
}

const CategoryChip = ({ category, className = '', onClick }: CategoryChipProps) => {
  const decodedCategoryName = decodeHtmlEntities(category.name);
  
  // Se onClick for fornecido, usar um button em vez de Link
  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className={`inline-block px-3 py-1 text-xs font-medium rounded-full bg-fashion-primary/10 text-fashion-primary hover:bg-fashion-primary/20 transition-colors ${className}`}
      >
        {decodedCategoryName}
      </button>
    );
  }
  
  return (
    <Link 
      to={`/categoria/${category.slug}`}
      className={`inline-block px-3 py-1 text-xs font-medium rounded-full bg-fashion-primary/10 text-fashion-primary hover:bg-fashion-primary/20 transition-colors ${className}`}
    >
      {decodedCategoryName}
    </Link>
  );
};

export default CategoryChip;
