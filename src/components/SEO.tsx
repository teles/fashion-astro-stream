
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  categories?: string[];
}

const SEO = ({
  title,
  description,
  image = '/og-image.png',
  article = false,
  publishedTime,
  modifiedTime,
  categories = []
}: SEOProps) => {
  const { pathname } = useLocation();
  const siteUrl = 'https://seamodapega.com.br';
  const canonical = `${siteUrl}${pathname}`;
  
  const siteTitle = 'Se A Moda Pega';
  const defaultTitle = 'Se A Moda Pega - Blog de Moda e Tendências';
  const defaultDescription = 'Seu portal sobre moda, tendências, beleza e estilo. Dicas, novidades e inspirações para você se manter sempre na moda.';
  
  const pageTitle = title ? `${title} | ${siteTitle}` : defaultTitle;
  const pageDescription = description || defaultDescription;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonical} />

      {/* OpenGraph Tags */}
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={`${siteUrl}${image}`} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      {article && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {article && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {article && categories.length > 0 && categories.map((category, i) => (
        <meta key={i} property="article:tag" content={category} />
      ))}

      {/* Twitter Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={`${siteUrl}${image}`} />
    </Helmet>
  );
};

export default SEO;
