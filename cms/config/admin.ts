export default ({ env }) => {
  const appEnv = env('APP_ENV', 'development');
  
  // Admin URL configuration for reverse proxy setups
  const adminUrls = {
    development: undefined, // Use default for local dev
    staging: '/cms/admin',
    production: '/cms/admin',
  };

  return {
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
    apiToken: {
      salt: env('API_TOKEN_SALT'),
    },
    transfer: {
      token: {
        salt: env('TRANSFER_TOKEN_SALT'),
      },
    },
    secrets: {
      encryptionKey: env('ENCRYPTION_KEY'),
    },
    flags: {
      nps: env.bool('FLAG_NPS', true),
      promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },
    // Set the admin panel path for staging/production
    url: adminUrls[appEnv],
  };
};
