
import { Link } from 'react-router-dom';
import { WpCategory } from '../types';

interface CategoryChipProps {
  category: WpCategory;
  className?: string;
}

const CategoryChip = ({ category, className = '' }: CategoryChipProps) => {
  return (
    <Link 
      to={`/categoria/${category.slug}`}
      className={`category-chip ${className}`}
    >
      {category.name}
    </Link>
  );
};

export default CategoryChip;
