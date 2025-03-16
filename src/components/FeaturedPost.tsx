
import { Link } from 'react-router-dom';
import { WpPost, WpCategory } from '../types';
import { formatDate, getPostImage, getExcerpt } from '../services/api';
import CategoryChip from './CategoryChip';

// Function to decode HTML entities
const decodeHtmlEntities = (text: string) => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
};

interface FeaturedPostProps {
  post: WpPost;
  className?: string;
}

const FeaturedPost = ({ post, className = '' }: FeaturedPostProps) => {
  const imageUrl = getPostImage(post, 'large');
  const postCategories = post._embedded?.['wp:term']?.[0] as WpCategory[] | undefined;
  const primaryCategory = postCategories?.[0];
  
  return (
    <article className={`group relative ${className}`}>
      <div className="relative after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/60 after:to-transparent">
        <img 
          src={imageUrl} 
          alt={decodeHtmlEntities(post.title.rendered)} 
          className="w-full h-[70vh] object-cover animate-image-scale"
        />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 z-10 transform transition-transform duration-300 group-hover:translate-y-[-10px]">
        {primaryCategory && (
          <CategoryChip 
            category={primaryCategory} 
            className="bg-white/90 backdrop-blur-sm mb-4" 
          />
        )}
        
        <Link to={`/post/${post.slug}`}>
          <h2 className="text-white mb-3 text-balance" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          <p className="text-white/90 mb-3 max-w-2xl line-clamp-2">{getExcerpt(post)}</p>
          <time className="text-sm text-white/80">{formatDate(post.date)}</time>
        </Link>
      </div>
    </article>
  );
};

export default FeaturedPost;
