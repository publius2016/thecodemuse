import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_STRAPI_GRAPHQL_URL || 'http://localhost:1337/graphql',
});

const authLink = setContext((_, { headers }) => {
  // Add any authentication headers here if needed
  return {
    headers: {
      ...headers,
      // Add API token if needed for private content
      // 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API_TOKEN}`,
    }
  }
});

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: ['filters', 'pagination', 'sort'], // Include filters in cache key
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
          authors: {
            keyArgs: ['sort'], // Include sort in cache key
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
          categories: {
            keyArgs: ['sort'], // Include sort in cache key
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
          tags: {
            keyArgs: ['sort'], // Include sort in cache key
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
}); 