'use client';

import React, { useState } from 'react';

interface NewsletterSignupFormProps {
  source: 'sticky_header' | 'blog_post' | 'footer' | 'popup' | 'homepage';
  className?: string;
  variant?: 'default' | 'compact' | 'expanded';
}

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
}

interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

export default function NewsletterSignupForm({ 
  source, 
  className = '', 
  variant = 'default' 
}: NewsletterSignupFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: ''
  });
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    error: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formState.error) {
      setFormState(prev => ({ ...prev, error: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setFormState(prev => ({ ...prev, error: 'Email is required' }));
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
      const response = await fetch(`${strapiUrl}/api/newsletter-signups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          source,
          sourceUrl: window.location.origin
        })
      });

      const data = await response.json();

      if (response.ok) {
        setFormState(prev => ({ ...prev, isSuccess: true, isSubmitting: false }));
        setFormData({ email: '', firstName: '', lastName: '' });
        
        // Show success message for a few seconds
        setTimeout(() => {
          setFormState(prev => ({ ...prev, isSuccess: false }));
        }, 5000);
      } else {
        setFormState(prev => ({ 
          ...prev, 
          error: data.error.message || 'Failed to subscribe. Please try again.',
          isSubmitting: false 
        }));
      }
    } catch {
      setFormState(prev => ({ 
        ...prev, 
        error: 'Network error. Please check your connection and try again.',
        isSubmitting: false 
      }));
    }
  };

  if (formState.isSuccess) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-4 text-center ${className}`}>
        <div className="text-green-600 font-medium">
          🎉 Newsletter Signup Successful!
        </div>
        <div className="text-green-500 text-sm mt-2">
          We've sent a verification email to <strong>{formData.email}</strong>
        </div>
        <div className="text-green-500 text-xs mt-2">
          Please check your inbox and click the verification link to complete your subscription.
        </div>
        <div className="text-gray-500 text-xs mt-3">
          Can't find the email? Check your spam folder.
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      <div className="p-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Stay Updated with The Code Muse
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Get the latest programming tips, tutorials, and insights delivered to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={formState.isSubmitting}
            />
          </div>

          {variant !== 'compact' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={formState.isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={formState.isSubmitting}
                />
              </div>
            </div>
          )}

          {formState.error && (
            <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-md p-2">
              {formState.error}
            </div>
          )}

          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            {formState.isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
          </button>
        </form>

        <div className="text-xs text-gray-500 text-center mt-3">
          By subscribing, you agree to our{' '}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
          {' '}and consent to receive marketing emails.
        </div>
      </div>
    </div>
  );
}
