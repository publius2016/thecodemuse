'use client';

import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

// Query to get the about page content
const GET_ABOUT_PAGE = gql`
  query GetAboutPage {
    pages(filters: { slug: { eq: "about" } }) {
      documentId
      title
      slug
      content
      seoTitle
      seoDescription
    }
  }
`;

export default function AboutPage() {
  const { loading, error, data } = useQuery(GET_ABOUT_PAGE);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading about page...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
        </div>
      </div>
    );
  }

  const pages = data?.pages || [];
  const page = pages[0];

  // If no about page exists in CMS, show default content
  if (!page) {
    return (
      <div className="bg-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">About Us</h1>
            <p className="text-xl text-primary-100">
              Learn more about our mission and the team behind The Code Muse.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg max-w-none">
            <h2>Welcome to The Code Muse</h2>
            <p>
              The Code Muse is a modern tech blog dedicated to exploring the latest in web development, 
              programming, and technology. We believe in sharing knowledge, fostering community, and 
              helping developers stay ahead of the curve in this ever-evolving field.
            </p>

            <h3>Our Mission</h3>
            <p>
              Our mission is to provide high-quality, practical content that helps developers of all 
              skill levels improve their craft. From beginner tutorials to advanced architectural 
              discussions, we cover topics that matter to the modern developer.
            </p>

            <h3>What We Cover</h3>
            <ul>
              <li><strong>Web Development:</strong> Modern frameworks, best practices, and cutting-edge techniques</li>
              <li><strong>Performance:</strong> Optimization strategies and performance monitoring</li>
              <li><strong>Tutorials:</strong> Step-by-step guides and practical examples</li>
              <li><strong>Architecture:</strong> System design and software engineering principles</li>
              <li><strong>Tools & Technologies:</strong> Reviews and comparisons of development tools</li>
            </ul>

            <h3>Our Approach</h3>
            <p>
              We believe in learning by doing. Our content is designed to be practical and actionable, 
              with real-world examples and code snippets that you can use in your own projects. 
              We also emphasize the importance of understanding the "why" behind the "how."
            </p>

            <h3>Join Our Community</h3>
            <p>
              We're building a community of developers who are passionate about learning and growing 
              together. Whether you're just starting your journey or you're a seasoned professional, 
              there's a place for you here.
            </p>

            <p>
              Ready to dive in? <a href="/blog" className="text-primary-600 hover:text-primary-800 underline">Start exploring our latest articles</a> or 
              <a href="/contact" className="text-primary-600 hover:text-primary-800 underline ml-1">get in touch</a> if you'd like to contribute or collaborate.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
          {page.seoDescription && (
            <p className="text-xl text-primary-100">
              {page.seoDescription}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          {page.content && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
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
              {page.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
} 