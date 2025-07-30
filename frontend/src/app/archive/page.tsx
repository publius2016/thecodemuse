'use client';

import { useQuery } from '@apollo/client';
import { GET_POSTS } from '@/lib/queries';
import { formatDate, getOptimizedImageUrl } from '@/lib/utils';
import { Calendar, Clock, User, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';

export default function ArchivePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const { loading, error, data } = useQuery(GET_POSTS, {
    variables: { limit: 100, start: 0 }, // Get more posts for archive
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading archive...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Archive</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
        </div>
      </div>
    );
  }

  const allPosts = data?.posts || [];

  // Process posts for archive organization
  const { postsByYear, years, months } = useMemo(() => {
    const postsByYear: { [key: string]: { [key: string]: any[] } } = {};
    const years = new Set<string>();
    const months = new Set<string>();

    allPosts.forEach((post: any) => {
      const date = new Date(post.publishedAt);
      const year = date.getFullYear().toString();
      const month = date.toLocaleString('default', { month: 'long' });
      
      years.add(year);
      months.add(month);

      if (!postsByYear[year]) {
        postsByYear[year] = {};
      }
      if (!postsByYear[year][month]) {
        postsByYear[year][month] = [];
      }
      postsByYear[year][month].push(post);
    });

    return {
      postsByYear,
      years: Array.from(years).sort((a, b) => parseInt(b) - parseInt(a)),
      months: Array.from(months).sort((a, b) => {
        const monthOrder = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return monthOrder.indexOf(b) - monthOrder.indexOf(a);
      }),
    };
  }, [allPosts]);

  // Filter posts based on search and filters
  const filteredPosts = useMemo(() => {
    let filtered = allPosts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((post: any) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter((post: any) => {
        const year = new Date(post.publishedAt).getFullYear().toString();
        return year === selectedYear;
      });
    }

    // Filter by month
    if (selectedMonth !== 'all') {
      filtered = filtered.filter((post: any) => {
        const month = new Date(post.publishedAt).toLocaleString('default', { month: 'long' });
        return month === selectedMonth;
      });
    }

    return filtered;
  }, [allPosts, searchTerm, selectedYear, selectedMonth]);

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Archive</h1>
          <p className="text-xl text-primary-100">
            Browse all our articles by date, search for specific topics, or explore by author.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles, authors, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Year Filter */}
            <div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Month Filter */}
            <div>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Months</option>
                {months.map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
            </p>
            {(searchTerm || selectedYear !== 'all' || selectedMonth !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedYear('all');
                  setSelectedMonth('all');
                }}
                className="text-sm text-primary-600 hover:text-primary-800 underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Archive Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Articles Found</h2>
            <p className="text-gray-600 mb-8">
              {searchTerm || selectedYear !== 'all' || selectedMonth !== 'all'
                ? 'Try adjusting your search terms or filters.'
                : 'It looks like there are no published articles yet.'}
            </p>
            {(searchTerm || selectedYear !== 'all' || selectedMonth !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedYear('all');
                  setSelectedMonth('all');
                }}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Show filtered results in a simple list */}
            {searchTerm || selectedYear !== 'all' || selectedMonth !== 'all' ? (
              <div className="space-y-6">
                {filteredPosts.map((post: any) => {
                  const featuredImage = post.featuredImage;
                  const author = post.author;
                  
                  return (
                    <article key={post.documentId} className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                      {/* Featured Image */}
                      {featuredImage && (
                        <div className="flex-shrink-0 w-full md:w-48 h-32 md:h-24">
                          <img
                            src={getOptimizedImageUrl(featuredImage, 'medium')}
                            alt={featuredImage.name || post.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(post.publishedAt)}</span>
                          {author && (
                            <>
                              <span className="mx-2">•</span>
                              <User className="h-4 w-4 mr-1" />
                              <span>{author.name}</span>
                            </>
                          )}
                          {post.readingTime && (
                            <>
                              <span className="mx-2">•</span>
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{post.readingTime} min read</span>
                            </>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          <Link href={`/blog/${post.slug}`} className="hover:text-primary-600 transition-colors">
                            {post.title}
                          </Link>
                        </h3>

                        {post.excerpt && (
                          <p className="text-gray-600 mb-3 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Categories */}
                        {post.categories?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {post.categories.map((category: any) => (
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
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* Show organized by year/month when no filters applied */
              years.map((year) => (
                <div key={year} className="space-y-6">
                  <h2 className="text-3xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                    {year}
                  </h2>
                  
                  {Object.entries(postsByYear[year])
                    .sort(([a], [b]) => {
                      const monthOrder = [
                        'January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'
                      ];
                      return monthOrder.indexOf(b) - monthOrder.indexOf(a);
                    })
                    .map(([month, posts]) => (
                      <div key={month} className="ml-6 space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {month} ({posts.length})
                        </h3>
                        
                        <div className="space-y-3">
                          {posts.map((post: any) => (
                            <div key={post.documentId} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="flex-shrink-0 text-sm text-gray-500 w-20">
                                {formatDate(post.publishedAt, 'MMM dd')}
                              </div>
                              <div className="flex-1">
                                <Link
                                  href={`/blog/${post.slug}`}
                                  className="text-gray-900 hover:text-primary-600 font-medium transition-colors"
                                >
                                  {post.title}
                                </Link>
                                {post.author && (
                                  <span className="text-sm text-gray-500 ml-2">
                                    by {post.author.name}
                                  </span>
                                )}
                              </div>
                              {post.readingTime && (
                                <div className="flex-shrink-0 text-sm text-gray-500">
                                  {post.readingTime} min read
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
} 