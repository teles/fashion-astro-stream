
import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchSinglePost, fetchPosts } from '../services/api';
import { WpPost, WpCategory } from '../types';
import PostCard from '../components/PostCard';
import CategoryChip from '../components/CategoryChip';
import SocialShare from '@/components/SocialShare';
import SEO from '@/components/SEO';
import SchemaMarkup from '@/components/SchemaMarkup';
import { decodeHtmlEntities, stripHtmlTags } from '@/lib/utils';
import { getPostImage } from '@/lib/api-utils';

const Post = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const fullUrl = `https://seamodapega.com.br${location.pathname}`;
  
  const { data: post, isLoading } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => fetchSinglePost(slug || ''),
  });
  
  const { data: relatedData } = useQuery({
    queryKey: ['posts', 'related', post?.categories],
    queryFn: () => fetchPosts({ 
      categories: post?.categories,
      perPage: 3
    }),
    enabled: !!post?.categories?.length,
  });
  
  const relatedPosts = relatedData?.posts.filter(p => p.id !== post?.id) || [];
  const postCategories = post?._embedded?.['wp:term']?.[0] as WpCategory[] | undefined;
  const imageUrl = post ? getPostImage(post, 'full') : '';
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  
  if (isLoading) {
    return (
      <div className="page-container">
        <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
          <div className="h-8 bg-fashion-lightGray rounded w-3/4 mx-auto mb-8 dark:bg-fashion-secondary/30" />
          <div className="h-4 bg-fashion-lightGray rounded w-1/4 mx-auto mb-12 dark:bg-fashion-secondary/30" />
          <div className="h-96 bg-fashion-lightGray rounded mb-12 dark:bg-fashion-secondary/30" />
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="h-4 bg-fashion-lightGray rounded dark:bg-fashion-secondary/30" />
            <div className="h-4 bg-fashion-lightGray rounded dark:bg-fashion-secondary/30" />
            <div className="h-4 bg-fashion-lightGray rounded w-4/5 dark:bg-fashion-secondary/30" />
            <div className="h-12 bg-fashion-lightGray rounded mt-8 dark:bg-fashion-secondary/30" />
            <div className="h-4 bg-fashion-lightGray rounded dark:bg-fashion-secondary/30" />
            <div className="h-4 bg-fashion-lightGray rounded dark:bg-fashion-secondary/30" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="page-container text-center">
        <h1 className="mb-4">Post não encontrado</h1>
        <p className="text-fashion-secondary">O post que você está procurando não existe ou foi removido.</p>
      </div>
    );
  }
  
  const postTitle = decodeHtmlEntities(post.title.rendered);
  const postDescription = stripHtmlTags(post.excerpt.rendered);
  const categoryNames = postCategories?.map(cat => cat.name) || [];
  
  return (
    <>
      <SEO 
        title={postTitle}
        description={postDescription}
        image={imageUrl}
        article={true}
        publishedTime={post.date}
        modifiedTime={post.modified}
        categories={categoryNames}
      />
      <SchemaMarkup post={post} url={fullUrl} />
      
      <main className="min-h-screen">
        <article itemScope itemType="https://schema.org/BlogPosting">
          <meta itemProp="mainEntityOfPage" content={fullUrl} />
          <meta itemProp="datePublished" content={post.date} />
          <meta itemProp="dateModified" content={post.modified} />
          <meta itemProp="author" content="Se A Moda Pega" />
          
          <header className="page-container max-w-4xl text-center">
            {postCategories && postCategories.length > 0 && (
              <div className="flex gap-2 justify-center mb-4">
                {postCategories.map(category => (
                  <CategoryChip key={category.id} category={category} />
                ))}
              </div>
            )}
            
            <h1 className="mb-4" dangerouslySetInnerHTML={{ __html: post.title.rendered }} itemProp="headline" />
            
            <time className="text-fashion-secondary" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            
            <SocialShare 
              url={fullUrl}
              title={postTitle}
              className="mt-4 justify-center"
            />
          </header>
          
          {imageUrl && (
            <figure className="mt-8 mb-12">
              <img 
                src={imageUrl} 
                alt={postTitle}
                className="w-full max-h-[70vh] object-cover"
                loading="lazy"
                decoding="async"
                itemProp="image"
              />
            </figure>
          )}
          
          <div className="page-container max-w-3xl">
            <div 
              className="post-content prose prose-lg prose-fashion dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              itemProp="articleBody"
            />
          </div>
        </article>
        
        {relatedPosts.length > 0 && (
          <section className="page-container max-w-6xl mt-12 md:mt-16">
            <h2 className="text-center mb-8">Posts Relacionados</h2>
            
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">
              {relatedPosts.map(post => (
                <PostCard key={post.id} post={post} variant="small" />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default Post;
