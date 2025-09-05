import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import NewsletterSignupForm from '@/components/newsletter/NewsletterSignupForm';
import { getOptimizedImageUrl } from '@/lib/utils';

// Define post type
interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  description?: string;
  publishedAt: string;
  isFeatured?: boolean;
  featuredImage?: {
    formats?: Record<string, { url: string }>;
    url?: string;
  } | null;
}

// Fetch posts data
async function getPosts(): Promise<Post[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/posts?populate=*&sort=publishedAt:desc&pagination[limit]=10`, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch posts');
    }
    
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const posts = await getPosts();
  
  // Find featured post
  const featuredPost = posts.find((post: Post) => post?.isFeatured);
  
  // Get recent posts (excluding featured post) with null checking
  const recentPosts = posts.filter((post: Post) => !post?.isFeatured).slice(0, 10);
  
  // Split recent posts into two columns
  const leftColumnPosts = recentPosts.slice(0, Math.ceil(recentPosts.length / 2));
  const rightColumnPosts = recentPosts.slice(Math.ceil(recentPosts.length / 2));

  return (
    <div className="bg-white">
      {/* Featured Post Section */}
      {featuredPost && featuredPost ? (
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Content - Above image on mobile, right side on desktop */}
              <div className="w-full lg:w-1/2 text-center lg:text-left order-1 lg:order-2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  {featuredPost.title || 'Featured Post'}
                </h1>

                {featuredPost.featuredImage && (
                <div className="block lg:hidden w-full lg:w-1/2 order-2 lg:order-1 pb-8">
                  <div className="aspect-video lg:aspect-square overflow-hidden rounded-xl shadow-lg">
                    <img
                      src={getOptimizedImageUrl(featuredPost.featuredImage, 'large')}
                      alt={featuredPost.title || 'Featured post image'}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              )}
                
                {/* Excerpt - Below image on mobile, below title on desktop */}
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl lg:max-w-none leading-relaxed order-3 lg:order-none">
                  {featuredPost.excerpt || featuredPost.description || 'Featured post description'}
                </p>
              </div>
              
              {/* Featured Image - Below title on mobile, left side on desktop */}
              {featuredPost.featuredImage && (
                <div className="hidden lg:block w-full lg:w-1/2 order-2 lg:order-1">
                  <div className="aspect-video lg:aspect-square overflow-hidden rounded-xl shadow-lg">
                    <img
                      src={getOptimizedImageUrl(featuredPost.featuredImage, 'large')}
                      alt={featuredPost.title || 'Featured post image'}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        // Fallback hero section if no featured post
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Welcome to{' '}
                <span className="text-primary-600">
                  {process.env.NEXT_PUBLIC_APP_NAME || 'The Code Muse'}
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                {process.env.NEXT_PUBLIC_APP_DESCRIPTION || 
                 'A modern tech blog exploring the latest in web development, programming, and technology.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  Explore Blog
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts Section - Two Column Layout */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {recentPosts.length > 0 ? (
            <>
              {/* Two Column Grid for Recent Posts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {leftColumnPosts.map((post: Post) => {
                    // Skip posts without proper attributes
                    if (!post) return null;
                    
                    return (
                      <article key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-4 flex pb-0">
                          {/* Featured Image */}
                          {post.featuredImage && (
                            <div className="mb-3 rounded-lg w-2/3 mr-5 h-20">
                              <img
                                src={getOptimizedImageUrl(post.featuredImage, 'thumbnail')}
                                alt={post.title || 'Post image'}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <h3 className="text-md text-gray-900 mb-3 w-full">
                            <Link href={`/blog/${post.slug || 'post'}`} className="hover:text-primary-600 transition-colors">
                              {post.title || 'Untitled Post'}
                            </Link>
                          </h3>
                        </div>
                        <div className="text-xs text-gray-500 text-right mr-4 pb-2">
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'No date'}
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {rightColumnPosts.map((post: Post) => {
                    // Skip posts without proper attributes
                    if (!post) return null;
                    
                    return (
                      <article key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-4 flex pb-0">
                          {/* Featured Image */}
                          {post.featuredImage && (
                            <div className="mb-3 rounded-lg w-2/3 mr-5 h-20">
                              <img
                                src={getOptimizedImageUrl(post.featuredImage, 'thumbnail')}
                                alt={post.title || 'Post image'}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <h3 className="text-md text-gray-900 mb-3 w-full">
                            <Link href={`/blog/${post.slug || 'post'}`} className="hover:text-primary-600 transition-colors">
                              {post.title || 'Untitled Post'}
                            </Link>
                          </h3>
                        </div>
                        <div className="text-xs text-gray-500 text-right mr-4 pb-2">
                          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'No date'}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            // Fallback if no posts
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                No Posts Yet
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Check back soon for our latest articles and tutorials.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Visit Blog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <div className="w-full sm:w-3/4 md:w-2/3 lg:w-2/5 xl:w-2/5 mx-auto">
            <NewsletterSignupForm source="homepage" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to dive in?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Start exploring our latest articles and tutorials to level up your development skills.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-100 transition-colors"
          >
            Browse Articles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
