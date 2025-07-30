'use client';

import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { formatDate, getOptimizedImageUrl } from '@/lib/utils';
import { Calendar, Clock, User, ArrowLeft, Github, Linkedin, Twitter, Globe, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Query to get author by slug with their posts
const GET_AUTHOR_BY_SLUG = gql`
  query GetAuthorBySlug($slug: String!) {
    authors(filters: { slug: { eq: $slug } }) {
      documentId
      name
      slug
      bio
      avatar {
        documentId
        name
        url
        formats
      }
      socialLinks {
        github
        linkedin
        twitter
        website
        instagram
        youtube
      }
      posts {
        documentId
        title
        slug
        excerpt
        readingTime
        publishedAt
        featuredImage {
          documentId
          name
          url
          formats
        }
        categories {
          documentId
          name
          slug
        }
      }
    }
  }
`;

interface AuthorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  
  return <AuthorPageClient slug={slug} />;
}

function AuthorPageClient({ slug }: { slug: string }) {
  const { loading, error, data } = useQuery(GET_AUTHOR_BY_SLUG, {
    variables: { slug },
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading author...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Author</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
        </div>
      </div>
    );
  }

  const authors = data?.authors || [];
  if (authors.length === 0) {
    notFound();
  }

  const author = authors[0];
  const posts = author.posts || [];

  return (
    <div className="bg-white">
      {/* Back to Authors */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/authors"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Authors
          </Link>
        </div>
      </div>

      {/* Author Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Author Avatar */}
            <div className="flex-shrink-0">
              {author.avatar ? (
                <img
                  src={getOptimizedImageUrl(author.avatar, 'large')}
                  alt={author.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-primary-100 flex items-center justify-center border-4 border-white shadow-lg">
                  <User className="h-16 w-16 text-primary-600" />
                </div>
              )}
            </div>

            {/* Author Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-4">{author.name}</h1>
              {author.bio && (
                <p className="text-xl text-primary-100 mb-6 max-w-3xl">
                  {author.bio}
                </p>
              )}

              {/* Social Links */}
              {author.socialLinks && (
                <div className="flex flex-wrap justify-center md:justify-start space-x-4">
                  {author.socialLinks.github && (
                    <a
                      href={author.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      <Github className="h-6 w-6" />
                    </a>
                  )}
                  {author.socialLinks.linkedin && (
                    <a
                      href={author.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      <Linkedin className="h-6 w-6" />
                    </a>
                  )}
                  {author.socialLinks.twitter && (
                    <a
                      href={author.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      <Twitter className="h-6 w-6" />
                    </a>
                  )}
                  {author.socialLinks.website && (
                    <a
                      href={author.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      <Globe className="h-6 w-6" />
                    </a>
                  )}
                  {author.socialLinks.instagram && (
                    <a
                      href={author.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      <Instagram className="h-6 w-6" />
                    </a>
                  )}
                  {author.socialLinks.youtube && (
                    <a
                      href={author.socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-gray-200 transition-colors"
                    >
                      <Youtube className="h-6 w-6" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Author's Posts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Posts by {author.name}
          </h2>
          <p className="text-gray-600">
            {posts.length} post{posts.length !== 1 ? 's' : ''} published
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Posts Yet</h3>
            <p className="text-gray-600">
              {author.name} hasn't published any posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => {
              const featuredImage = post.featuredImage;
              
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
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      <Link href={`/blog/${post.slug}`} className="hover:text-primary-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(post.publishedAt)}</span>
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