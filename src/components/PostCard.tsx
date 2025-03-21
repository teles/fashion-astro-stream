
import { Link } from 'react-router-dom';
import { WpPost, WpCategory } from '@/types';
import { formatDate } from '@/lib/utils';
import { getPostImage, getPostExcerpt } from '@/lib/api-utils';
import CategoryChip from './CategoryChip';
import { decodeHtmlEntities } from '@/lib/utils';

interface PostCardProps {
  post: WpPost;
  categories?: WpCategory[];
  variant?: 'normal' | 'small' | 'horizontal';
  className?: string;
}

const PostCard = ({ post, categories, variant = 'normal', className = '' }: PostCardProps) => {
  const imageUrl = getPostImage(post, variant === 'small' ? 'medium' : 'large');
  const postCategories = post._embedded?.['wp:term']?.[0] as WpCategory[] | undefined;
  const primaryCategory = postCategories?.[0] || categories?.find(c => post.categories.includes(c.id));
  const postTitle = decodeHtmlEntities(post.title.rendered);
  const excerpt = getPostExcerpt(post);
  
  if (variant === 'small') {
    return (
      <article className={`group hover-scale ${className}`}>
        <Link to={`/${post.slug}`} className="block">
          <div className="image-hover-zoom mb-3">
            <img 
              src={imageUrl} 
              alt={postTitle} 
              className="aspect-square object-cover w-full"
              loading="lazy"
            />
          </div>
          <h4 className="text-base mb-1 line-clamp-2 text-balance" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          <time className="text-xs text-fashion-secondary">{formatDate(post.date)}</time>
        </Link>
      </article>
    );
  }
  
  if (variant === 'horizontal') {
    return (
      <article className={`group grid md:grid-cols-2 gap-6 hover-scale ${className}`}>
        <Link to={`/${post.slug}`} className="block image-hover-zoom">
          <img 
            src={imageUrl} 
            alt={postTitle} 
            className="aspect-[4/3] md:aspect-square object-cover w-full h-full"
            loading="lazy"
          />
        </Link>
        <div className="flex flex-col">
          {primaryCategory && (
            <CategoryChip category={primaryCategory} className="self-start mb-3" />
          )}
          <Link to={`/${post.slug}`}>
            <h3 className="mb-3 text-balance" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </Link>
          <p className="mb-3 line-clamp-3">{excerpt}</p>
          <time className="text-sm text-fashion-secondary mt-auto">{formatDate(post.date)}</time>
        </div>
      </article>
    );
  }
  
  // Default (normal) variant
  return (
    <article className={`group hover-scale ${className}`}>
      <Link to={`/${post.slug}`} className="block">
        <div className="image-hover-zoom mb-4">
          <img 
            src={imageUrl} 
            alt={postTitle} 
            className="aspect-[4/3] object-cover w-full"
            loading="lazy"
          />
        </div>
        
        {primaryCategory && (
          <CategoryChip category={primaryCategory} className="mb-3" />
        )}
        
        <h3 className="mb-2 text-balance" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        <p className="mb-3 line-clamp-2">{excerpt}</p>
        <time className="text-sm text-fashion-secondary">{formatDate(post.date)}</time>
      </Link>
    </article>
  );
};

export default PostCard;
