import { getPosts } from '@/lib/data';
import { formatDate, getOptimizedImageUrl } from '@/lib/utils';
import Link from 'next/link';
import { Calendar, Clock, User } from 'lucide-react';

// Force dynamic rendering to fetch fresh data from CMS
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  let posts = [];
  let error = null;

  try {
    const response = await getPosts({ limit: 10, start: 0 });
    posts = response.data || [];
  } catch (err) {
    console.error('Error fetching posts:', err);
    error = err instanceof Error ? err : new Error('Failed to fetch posts');
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Posts</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <p className="text-sm text-gray-500">
            Make sure your Strapi backend is running at {process.env.NEXT_PUBLIC_STRAPI_URL}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-primary-100">
            Latest insights, tutorials, and thoughts on web development and technology.
          </p>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Posts Found</h2>
            <p className="text-gray-600">
              It looks like there are no published posts yet. Check back soon!
            </p>
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
                    {/* Categories */}
                    {post.categories?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.categories.slice(0, 2).map((category: any) => (
                          <Link
                            key={category.documentId}
                            href={`/blog/category/${category.slug}`}
                            className="inline-block bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded hover:bg-primary-200 transition-colors"
                          >
                            {category.name}
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