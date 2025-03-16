
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPosts } from '../services/api';
import { WpPost } from '../types';
import FeaturedPost from '../components/FeaturedPost';
import PostCard from '../components/PostCard';

const Index = () => {
  const { data: featuredData } = useQuery({
    queryKey: ['posts', 'featured'],
    queryFn: () => fetchPosts({ perPage: 1 }),
  });

  const { data: recentData } = useQuery({
    queryKey: ['posts', 'recent'],
    queryFn: () => fetchPosts({ perPage: 6, page: 1 }),
  });

  const featuredPost = featuredData?.posts[0];
  const recentPosts = recentData?.posts.filter(post => post.id !== featuredPost?.id) || [];

  return (
    <main className="min-h-screen flex flex-col">
      {featuredPost && (
        <FeaturedPost post={featuredPost} />
      )}
      
      <section className="page-container">
        <h2 className="text-center mb-8">Últimos Posts</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {recentPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Index;
