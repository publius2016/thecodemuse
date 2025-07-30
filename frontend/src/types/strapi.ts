// Base Strapi types
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Media types
export interface StrapiMedia {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiMediaFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path?: string;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

// Social Links component
export interface SocialLinks {
  id: number;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  instagram?: string;
  youtube?: string;
}

// Author type
export interface Author extends StrapiEntity {
  name: string;
  slug: string;
  bio?: string;
  avatar?: StrapiMedia;
  email?: string;
  socialLinks?: SocialLinks;
  posts?: Post[];
}

// Category type
export interface Category extends StrapiEntity {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  posts?: Post[];
}

// Tag type
export interface Tag extends StrapiEntity {
  name: string;
  slug: string;
  description?: string;
  posts?: Post[];
}

// Post type
export interface Post extends StrapiEntity {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featuredImage?: StrapiMedia;
  readingTime?: number;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  author?: Author;
  categories?: Category[];
  tags?: Tag[];
}

// Page type
export interface Page extends StrapiEntity {
  title: string;
  slug: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  isHomePage: boolean;
  order?: number;
}

// Contact Submission type
export interface ContactSubmission extends StrapiEntity {
  name: string;
  email: string;
  subject: string;
  message: string;
  ipAddress?: string;
  userAgent?: string;
  isRead: boolean;
  response?: string;
}

// API Response types
export type AuthorsResponse = StrapiResponse<Author[]>;
export type AuthorResponse = StrapiResponse<Author>;
export type PostsResponse = StrapiResponse<Post[]>;
export type PostResponse = StrapiResponse<Post>;
export type CategoriesResponse = StrapiResponse<Category[]>;
export type CategoryResponse = StrapiResponse<Category>;
export type TagsResponse = StrapiResponse<Tag[]>;
export type TagResponse = StrapiResponse<Tag>;
export type PagesResponse = StrapiResponse<Page[]>;
export type PageResponse = StrapiResponse<Page>;
export type ContactSubmissionResponse = StrapiResponse<ContactSubmission>; 