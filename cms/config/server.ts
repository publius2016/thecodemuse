export default ({ env }) => {
  // Get app keys from environment or generate fallback
  const appKeys = env.array('APP_KEYS');
  
  if (!appKeys || appKeys.length === 0) {
    console.warn('⚠️  APP_KEYS not found in environment variables');
    console.warn('💡 Run: npm run env:generate to create .env file with secure keys');
    console.warn('🔧 Using fallback keys (NOT SECURE FOR PRODUCTION)');
    
    // Fallback keys for development only
    return {
      host: env('HOST', '0.0.0.0'),
      port: env.int('PORT', 1337),
      app: {
        keys: ['fallback-key-1', 'fallback-key-2', 'fallback-key-3', 'fallback-key-4'],
      },
    };
  }

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int('PORT', 1337),
    app: {
      keys: appKeys,
    },
  };
};
