
import fs from 'fs';
import { fetchPosts, fetchCategories } from '@/services/api';

/**
 * Generates a sitemap.xml file for the website
 */
export async function generateSitemap() {
  try {
    const { posts } = await fetchPosts({ perPage: 1000 });
    const categories = await fetchCategories();
    
    const baseUrl = 'https://seamodapega.com.br';
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;
    
    // Add all post URLs
    posts.forEach(post => {
      sitemap += `
  <url>
    <loc>${baseUrl}/${post.slug}</loc>
    <lastmod>${new Date(post.modified).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
    
    // Add all category URLs
    categories.forEach(category => {
      sitemap += `
  <url>
    <loc>${baseUrl}/categoria/${category.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });
    
    sitemap += `
</urlset>`;
    
    fs.writeFileSync('./public/sitemap.xml', sitemap);
    console.log('Sitemap generated successfully!');
    
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}
