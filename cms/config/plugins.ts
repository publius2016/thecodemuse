export default ({ env }) => ({
  'graphql': {
    enabled: true,
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 7,
      amountLimit: 100,
      apolloServer: {
        tracing: false,
        introspection: true,
      },
    },
  },
  'upload': {
    config: {
      provider: 'local',
      sizeLimit: 10 * 1024 * 1024, // 10MB in bytes
      providerOptions: {
        local: {
          sizeLimit: 10 * 1024 * 1024, // 10MB in bytes
        },
      },
    },
  },
});
