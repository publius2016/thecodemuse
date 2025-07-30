'use client';

import { useQuery } from '@apollo/client';
import { GET_POST_BY_SLUG } from '@/lib/queries';
import { formatDate, getOptimizedImageUrl } from '@/lib/utils';
import { Calendar, Clock, User, ArrowLeft, Share2, Tag, Folder } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  
  return <PostPageClient slug={slug} />;
}

function PostPageClient({ slug }: { slug: string }) {
  const { loading, error, data } = useQuery(GET_POST_BY_SLUG, {
    variables: { slug },
    fetchPolicy: 'network-only', // Force fresh data until cache is cleared
  });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Post</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <p className="text-sm text-gray-500">Slug: {slug}</p>
        </div>
      </div>
    );
  }

  const posts = data?.posts || [];
  
  if (posts.length === 0) {
    notFound();
  }

  const post = posts[0];
  const featuredImage = post.featuredImage;
  const author = post.author;

  return (
    <div className="bg-white">
      {/* Back to Blog */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Categories */}
        {post.categories?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.categories.map((category: any) => (
              <Link
                key={category.documentId}
                href={`/blog/category/${category.slug}`}
                className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full hover:bg-primary-200 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center space-x-6 mb-4 sm:mb-0">
            {/* Author */}
            {author && (
              <div className="flex items-center">
                {author.avatar && (
                  <img
                    src={getOptimizedImageUrl(author.avatar, 'small')}
                    alt={author.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{author.name}</p>
                  {author.bio && (
                    <p className="text-xs text-gray-500">{author.bio}</p>
                  )}
                </div>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>

            {/* Reading Time */}
            {post.readingTime && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.readingTime} min read</span>
              </div>
            )}
          </div>

          {/* Share Button */}
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </button>
        </div>

        {/* Featured Image */}
        {featuredImage && (
          <div className="mb-8">
            <img
              src={getOptimizedImageUrl(featuredImage, 'large')}
              alt={featuredImage.name || post.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
            {featuredImage.caption && (
              <p className="text-sm text-gray-500 text-center mt-2">
                {featuredImage.caption}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {post.content && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                // Custom components for better styling
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-gray-100 text-red-600 px-1 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  ) : (
                    <code className={className}>{children}</code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-700 my-6">
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">
                    {children}
                  </ol>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-primary-600 hover:text-primary-800 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center mb-4">
              <Tag className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: any) => (
                <Link
                  key={tag.documentId}
                  href={`/blog/tag/${tag.slug}`}
                  className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        {author && author.bio && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-start">
              {author.avatar && (
                <img
                  src={getOptimizedImageUrl(author.avatar, 'medium')}
                  alt={author.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  About {author.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">{author.bio}</p>
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
} 