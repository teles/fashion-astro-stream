
import { WpPost, WpCategory } from '@/types';
import { decodeHtmlEntities, stripHtmlTags } from '@/lib/utils';

interface SchemaMarkupProps {
  post: WpPost;
  url: string;
}

const SchemaMarkup = ({ post, url }: SchemaMarkupProps) => {
  const postCategories = post._embedded?.['wp:term']?.[0] as WpCategory[] | undefined;
  const categoryNames = postCategories?.map(cat => cat.name) || [];
  
  const title = decodeHtmlEntities(post.title.rendered);
  const description = stripHtmlTags(post.excerpt.rendered);
  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
  const datePublished = post.date;
  const dateModified = post.modified;
  const authorName = post._embedded?.['author']?.[0]?.name || 'Se A Moda Pega';
  
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: imageUrl,
    datePublished: datePublished,
    dateModified: dateModified,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Se A Moda Pega',
      logo: {
        '@type': 'ImageObject',
        url: 'https://seamodapega.com.br/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    keywords: categoryNames.join(', ')
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

export default SchemaMarkup;
