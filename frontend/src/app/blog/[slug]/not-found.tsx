import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Blog */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </div>

        {/* 404 Content */}
        <div className="text-center">
          <div className="mb-8">
            <Search className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Post Not Found
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Sorry, the blog post you're looking for doesn't exist or may have been moved.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              Browse All Posts
            </Link>
            <div>
              <Link
                href="/"
                className="text-primary-600 hover:text-primary-800 underline"
              >
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 