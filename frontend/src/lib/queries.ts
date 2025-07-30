import { gql } from '@apollo/client';

// Query to get all posts with basic information
export const GET_POSTS = gql`
  query GetPosts($limit: Int, $start: Int) {
    posts(pagination: { limit: $limit, start: $start }, sort: ["publishedAt:desc"]) {
      documentId
      title
      slug
      excerpt
      content
      readingTime
      isFeatured
      seoTitle
      seoDescription
      publishedAt
      createdAt
      updatedAt
      featuredImage {
        documentId
        name
        url
        formats
        width
        height
      }
      author {
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
      }
      categories {
        documentId
        name
        slug
        description
        color
      }
      tags {
        documentId
        name
        slug
        description
      }
    }
  }
`;

// Query to get posts by category
export const GET_POSTS_BY_CATEGORY = gql`
  query GetPostsByCategory($categorySlug: String!, $limit: Int, $start: Int) {
    posts(
      filters: { categories: { slug: { eq: $categorySlug } } }
      pagination: { limit: $limit, start: $start }
      sort: ["publishedAt:desc"]
    ) {
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
      author {
        documentId
        name
        slug
        avatar {
          documentId
          name
          url
          formats
        }
      }
      categories {
        documentId
        name
        slug
        description
        color
      }
    }
  }
`;

// Query to get posts by tag
export const GET_POSTS_BY_TAG = gql`
  query GetPostsByTag($tagSlug: String!, $limit: Int, $start: Int) {
    posts(
      filters: { tags: { slug: { eq: $tagSlug } } }
      pagination: { limit: $limit, start: $start }
      sort: ["publishedAt:desc"]
    ) {
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
      author {
        documentId
        name
        slug
        avatar {
          documentId
          name
          url
          formats
        }
      }
      tags {
        documentId
        name
        slug
        description
      }
    }
  }
`;

// Query to get a single post by slug
export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: String!) {
    posts(filters: { slug: { eq: $slug } }) {
      documentId
      title
      slug
      excerpt
      content
      readingTime
      isFeatured
      seoTitle
      seoDescription
      publishedAt
      createdAt
      updatedAt
      featuredImage {
        documentId
        name
        url
        formats
        width
        height
      }
      author {
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
      }
      categories {
        documentId
        name
        slug
        description
        color
      }
      tags {
        documentId
        name
        slug
        description
      }
    }
  }
`;

// Query to get all authors
export const GET_AUTHORS = gql`
  query GetAuthors {
    authors(sort: ["name:asc"]) {
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
    }
  }
`;

// Query to get all categories
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories(sort: ["name:asc"]) {
      documentId
      name
      slug
      description
      color
    }
  }
`;

// Query to get a single category by slug
export const GET_CATEGORY_BY_SLUG = gql`
  query GetCategoryBySlug($slug: String!) {
    categories(filters: { slug: { eq: $slug } }) {
      documentId
      name
      slug
      description
      color
    }
  }
`;

// Query to get all tags
export const GET_TAGS = gql`
  query GetTags {
    tags(sort: ["name:asc"]) {
      documentId
      name
      slug
      description
    }
  }
`;

// Query to get a single tag by slug
export const GET_TAG_BY_SLUG = gql`
  query GetTagBySlug($slug: String!) {
    tags(filters: { slug: { eq: $slug } }) {
      documentId
      name
      slug
      description
    }
  }
`;

// Query to get featured posts
export const GET_FEATURED_POSTS = gql`
  query GetFeaturedPosts($limit: Int = 3) {
    posts(
      filters: { isFeatured: { eq: true } }
      pagination: { limit: $limit }
      sort: ["publishedAt:desc"]
    ) {
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
      author {
        documentId
        name
        slug
        avatar {
          documentId
          name
          url
          formats
        }
      }
    }
  }
`; 