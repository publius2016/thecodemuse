/**
 * Server-side data fetching functions for blog content
 * These functions run on the server and can access Strapi directly
 */

export interface Post {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  publishedAt: string;
  readingTime?: number;
  isFeatured?: boolean;
  featuredImage?: {
    id: number;
    name: string;
    url: string;
    formats?: Record<string, { url: string; width: number; height: number }>;
    caption?: string;
  } | null;
  author?: {
    id: number;
    documentId: string;
    name: string;
    bio?: string;
    avatar?: {
      id: number;
      name: string;
      url: string;
      formats?: Record<string, { url: string; width: number; height: number }>;
    } | null;
  } | null;
  categories?: Array<{
    id: number;
    documentId: string;
    name: string;
    slug: string;
  }>;
  tags?: Array<{
    id: number;
    documentId: string;
    name: string;
    slug: string;
  }>;
}

export interface PostsResponse {
  data: Post[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface PostResponse {
  data: Post[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Get the Strapi base URL from environment variables
 */
function getStrapiUrl(): string {
  const url = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  return url.replace(/\/$/, ''); // Remove trailing slash
}

/**
 * Fetch posts from Strapi API
 */
export async function getPosts(params: {
  limit?: number;
  start?: number;
  sort?: string;
  filters?: Record<string, any>;
  populate?: string | string[];
} = {}): Promise<PostsResponse> {
  const {
    limit = 10,
    start = 0,
    sort = 'publishedAt:desc',
    filters = {},
    populate = '*'  // Use wildcard for Strapi v5 compatibility
  } = params;

  const searchParams = new URLSearchParams({
    'pagination[limit]': limit.toString(),
    'pagination[start]': start.toString(),
    sort,
  });
  
  // Handle populate parameter - Strapi v5 uses array syntax or wildcard
  if (typeof populate === 'string') {
    searchParams.append('populate', populate);
  } else if (Array.isArray(populate)) {
    populate.forEach((field, index) => {
      searchParams.append(`populate[${index}]`, field);
    });
  }

  // Add filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(`filters[${key}]`, value.toString());
    }
  });

  const url = `${getStrapiUrl()}/api/posts?${searchParams.toString()}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

/**
 * Fetch a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const response = await getPosts({
      filters: { slug },
      limit: 1,
      populate: '*'  // Use wildcard for Strapi v5 compatibility
    });

    return response.data.length > 0 ? response.data[0] : null;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

/**
 * Fetch posts by category slug
 */
export async function getPostsByCategory(categorySlug: string, params: {
  limit?: number;
  start?: number;
} = {}): Promise<PostsResponse> {
  return getPosts({
    ...params,
    filters: {
      'categories.slug': categorySlug
    }
  });
}

/**
 * Fetch posts by tag slug
 */
export async function getPostsByTag(tagSlug: string, params: {
  limit?: number;
  start?: number;
} = {}): Promise<PostsResponse> {
  return getPosts({
    ...params,
    filters: {
      'tags.slug': tagSlug
    }
  });
}

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Array<{
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
}>> {
  try {
    const url = `${getStrapiUrl()}/api/categories?sort=name:asc&pagination[limit]=100`;
    
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Fetch all tags
 */
export async function getTags(): Promise<Array<{
  id: number;
  documentId: string;
  name: string;
  slug: string;
}>> {
  try {
    const url = `${getStrapiUrl()}/api/tags?sort=name:asc&pagination[limit]=100`;
    
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
}

/**
 * Fetch all authors
 */
export async function getAuthors(): Promise<Array<{
  id: number;
  documentId: string;
  name: string;
  bio?: string;
  avatar?: {
    id: number;
    name: string;
    url: string;
    formats?: Record<string, { url: string; width: number; height: number }>;
  } | null;
}>> {
  try {
    const url = `${getStrapiUrl()}/api/authors?populate=*&sort=name:asc&pagination[limit]=100`;
    
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch authors: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
}

/**
 * Fetch a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<{
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
} | null> {
  try {
    const url = `${getStrapiUrl()}/api/categories?filters[slug][$eq]=${slug}&pagination[limit]=1`;
    
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch category: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data && data.data.length > 0 ? data.data[0] : null;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

/**
 * Fetch a single tag by slug
 */
export async function getTagBySlug(slug: string): Promise<{
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
} | null> {
  try {
    const url = `${getStrapiUrl()}/api/tags?filters[slug][$eq]=${slug}&pagination[limit]=1`;
    
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tag: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data && data.data.length > 0 ? data.data[0] : null;
  } catch (error) {
    console.error('Error fetching tag by slug:', error);
    return null;
  }
}
