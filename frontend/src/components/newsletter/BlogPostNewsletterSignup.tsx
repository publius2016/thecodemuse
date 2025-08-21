'use client';

import React from 'react';
import NewsletterSignupForm from './NewsletterSignupForm';

interface BlogPostNewsletterSignupProps {
  postTitle?: string;
  className?: string;
}

export default function BlogPostNewsletterSignup({ 
  postTitle, 
  className = '' 
}: BlogPostNewsletterSignupProps) {
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 my-12 ${className}`}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Stay Updated with The Code Muse
        </h3>
        
        <p className="text-gray-600 max-w-2xl mx-auto">
          {postTitle ? (
            <>
              Enjoyed this post about <span className="font-semibold text-gray-800">{postTitle}</span>? 
              Get more programming insights, tutorials, and tech tips delivered straight to your inbox.
            </>
          ) : (
            "Get the latest programming insights, tutorials, and tech tips delivered straight to your inbox."
          )}
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <NewsletterSignupForm 
          source="blog_post"
          variant="default"
          className="bg-white rounded-lg shadow-sm"
        />
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          Join <span className="font-semibold">2,000+ developers</span> who get our weekly insights
        </p>
        <p className="text-xs text-gray-400 mt-1">
          No spam, unsubscribe at any time
        </p>
      </div>
    </div>
  );
}
