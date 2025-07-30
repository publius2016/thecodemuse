'use client';

import { useQuery } from '@apollo/client';
import { GET_AUTHORS } from '@/lib/queries';
import { getOptimizedImageUrl } from '@/lib/utils';
import Link from 'next/link';
import { User, Github, Linkedin, Twitter, Globe, ArrowRight } from 'lucide-react';

export default function AuthorsPage() {
  const { loading, error, data } = useQuery(GET_AUTHORS);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Authors</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
        </div>
      </div>
    );
  }

  const authors = data?.authors || [];

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Our Authors</h1>
          <p className="text-xl text-primary-100">
            Meet the talented developers and writers behind The Code Muse.
          </p>
        </div>
      </div>

      {/* Authors Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {authors.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Authors Found</h2>
            <p className="text-gray-600">
              It looks like there are no authors yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authors.map((author: any) => (
              <div key={author.documentId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Author Avatar */}
                <div className="p-6 text-center">
                  {author.avatar ? (
                    <img
                      src={getOptimizedImageUrl(author.avatar, 'medium')}
                      alt={author.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-primary-100 flex items-center justify-center">
                      <User className="h-12 w-12 text-primary-600" />
                    </div>
                  )}

                  {/* Author Name */}
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    <Link href={`/authors/${author.slug}`} className="hover:text-primary-600 transition-colors">
                      {author.name}
                    </Link>
                  </h2>

                  {/* Author Bio */}
                  {author.bio && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {author.bio}
                    </p>
                  )}

                  {/* Social Links */}
                  {author.socialLinks && (
                    <div className="flex justify-center space-x-3 mb-4">
                      {author.socialLinks.github && (
                        <a
                          href={author.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                      {author.socialLinks.linkedin && (
                        <a
                          href={author.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {author.socialLinks.twitter && (
                        <a
                          href={author.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {author.socialLinks.website && (
                        <a
                          href={author.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          <Globe className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* View Profile Button */}
                  <Link
                    href={`/authors/${author.slug}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium transition-colors"
                  >
                    View Profile
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 