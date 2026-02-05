export default ({ env }) => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const appEnv = env('APP_ENV', nodeEnv);
  
  console.log('🔧 SERVER CONFIG LOADING - Environment:', appEnv.toUpperCase());
  
  // Environment-specific server configurations
  const serverConfigs = {
    development: {
      host: env('DEV_STRAPI_HOST', '0.0.0.0'),
      port: env.int('DEV_STRAPI_PORT', 1337),
    },
    
    staging: {
      host: env('STAGING_STRAPI_HOST', '0.0.0.0'),
      port: env.int('STAGING_STRAPI_PORT', 1337),
      url: env('PUBLIC_URL', 'https://staging.thecodemuse.com/cms'),
    },
    
    production: {
      host: env('PROD_STRAPI_HOST', '0.0.0.0'),
      port: env.int('PROD_STRAPI_PORT', 1337),
    }
  };

  // Get configuration for current environment
  const serverConfig = serverConfigs[appEnv as keyof typeof serverConfigs] || serverConfigs.development;
  
  // Get app keys from environment or generate fallback
  const appKeys = env.array('APP_KEYS');
  
  if (!appKeys || appKeys.length === 0) {
    console.warn('⚠️  APP_KEYS not found in environment variables');
    console.warn('💡 Run: npm run env:generate to create .env file with secure keys');
    
    if (appEnv === 'production') {
      throw new Error('APP_KEYS are required in production environment');
    }
    
    console.warn('🔧 Using fallback keys (NOT SECURE FOR PRODUCTION)');
    
    // Fallback keys for development/staging only
    return {
      ...serverConfig,
      app: {
        keys: ['fallback-key-1', 'fallback-key-2', 'fallback-key-3', 'fallback-key-4'],
      },
    };
  }

  // Log current environment info (only in development)
  if (appEnv === 'development') {
    console.log(`🌐 Strapi Server: ${serverConfig.host}:${serverConfig.port}`);
  }

  return {
    ...serverConfig,
    app: {
      keys: appKeys,
    },
  };
};
