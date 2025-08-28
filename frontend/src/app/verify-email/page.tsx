'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useNewsletterModal } from '@/components/newsletter/NewsletterModalContext';

type VerificationStatus = 'verifying' | 'success' | 'error' | 'expired';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openModal } = useNewsletterModal();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setVerificationStatus('error');
      setErrorMessage('No verification token provided.');
      return;
    }
    
    // Call Strapi verification endpoint
    verifyEmail(token);
  }, [searchParams]);
  
  const verifyEmail = async (token: string) => {
    try {
      const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
      const response = await fetch(`${strapiUrl}/api/newsletter-signups/verify/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        setVerificationStatus('success');
      } else {
        const errorData = await response.json();
        if (errorData.error?.message?.includes('expired')) {
          setVerificationStatus('expired');
        } else {
          setVerificationStatus('error');
          setErrorMessage(errorData.error?.message || 'Verification failed. Please try again.');
        }
      }
    } catch (error) {
      setVerificationStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };
  
  // Loading/Verifying State
  if (verificationStatus === 'verifying') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Email</h1>
          <p className="text-gray-600">Please wait while we verify your newsletter subscription...</p>
        </div>
      </div>
    );
  }
  
  // Success State
  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified Successfully! 🎉</h1>
          <p className="text-gray-600 mb-6">
            Your newsletter subscription is now active. You'll receive our latest programming insights, tutorials, and tech tips delivered straight to your inbox.
          </p>
          <div className="space-y-3">
            <Link
              href="/blog"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              Explore Our Blog
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-md transition-colors"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Expired Token State
  if (verificationStatus === 'expired') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Link Expired</h1>
          <p className="text-gray-600 mb-6">
            This verification link has expired. Verification links are valid for 24 hours. You'll need to sign up for the newsletter again.
          </p>
          <div className="space-y-3">
            <button
              onClick={openModal}
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              Sign Up Again
            </button>
            <Link
              href="/blog"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-md transition-colors"
            >
              Browse Our Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Error State
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
        <p className="text-gray-600 mb-6">
          {errorMessage || 'We encountered an error while verifying your email. Please try again or contact support if the problem persists.'}
        </p>
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            Back to Homepage
          </Link>
          <Link
            href="/contact"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-md transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
