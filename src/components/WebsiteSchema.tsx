
interface WebsiteSchemaProps {
  url: string;
}

const WebsiteSchema = ({ url }: WebsiteSchemaProps) => {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Se A Moda Pega',
    url: url,
    description: 'Seu portal sobre moda, tendências, beleza e estilo.',
    potentialAction: {
      '@type': 'SearchAction',
      target: '{search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

export default WebsiteSchema;
