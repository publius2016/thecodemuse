'use client';

import { useQuery } from '@apollo/client';
import { GET_POSTS_BY_TAG, GET_TAG_BY_SLUG } from '@/lib/queries';
import { formatDate, getOptimizedImageUrl } from '@/lib/utils';
import { Calendar, Clock, User, ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface TagPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  
  return <TagPageClient slug={slug} />;
}

function TagPageClient({ slug }: { slug: string }) {
  const { loading: tagLoading, data: tagData } = useQuery(GET_TAG_BY_SLUG, {
    variables: { slug },
  });

  const { loading: postsLoading, error: postsError, data: postsData } = useQuery(GET_POSTS_BY_TAG, {
    variables: { tagSlug: slug, limit: 20, start: 0 },
  });

  if (tagLoading || postsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tag...</p>
        </div>
      </div>
    );
  }

  if (postsError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Posts</h2>
          <p className="text-gray-600 mb-4">{postsError.message}</p>
        </div>
      </div>
    );
  }

  const tags = tagData?.tags || [];
  if (tags.length === 0) {
    notFound();
  }

  const tag = tags[0];
  const posts = postsData?.posts || [];

  return (
    <div className="bg-white">
      {/* Back to Blog */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Tag Header */}
      <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <Tag className="h-8 w-8 mr-3" />
            <h1 className="text-4xl font-bold">Tag: {tag.name}</h1>
          </div>
          {tag.description && (
            <p className="text-xl text-gray-100 max-w-3xl">
              {tag.description}
            </p>
          )}
          <p className="text-gray-100 mt-4">
            {posts.length} post{posts.length !== 1 ? 's' : ''} with this tag
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Posts Found</h2>
            <p className="text-gray-600 mb-8">
              There are no published posts with this tag yet.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Browse All Posts
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => {
              const featuredImage = post.featuredImage;
              const author = post.author;
              
              return (
                <article key={post.documentId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Featured Image */}
                  {featuredImage && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={getOptimizedImageUrl(featuredImage, 'medium')}
                        alt={featuredImage.name || post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    {/* Tags */}
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.slice(0, 3).map((tag: any) => (
                          <Link
                            key={tag.documentId}
                            href={`/blog/tag/${tag.slug}`}
                            className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                          >
                            {tag.name}
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      <Link href={`/blog/${post.slug}`} className="hover:text-primary-600 transition-colors">
                        {post.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        {author && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>{author.name}</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                      </div>
                      {post.readingTime && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{post.readingTime} min read</span>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 