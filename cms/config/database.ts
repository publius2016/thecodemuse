export default ({ env }) => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const appEnv = env('APP_ENV', nodeEnv);
  
  console.log('🔧 DATABASE CONFIG LOADING - Environment:', appEnv.toUpperCase());
  
  // Helper to get SSL config (Supabase requires rejectUnauthorized: false)
  const getSSLConfig = (envVar: string, defaultValue: string) => {
    const sslEnabled = env(envVar, defaultValue) === 'true';
    return sslEnabled ? { rejectUnauthorized: false } : false;
  };
  
  // Environment-specific database configurations
  const databaseConfigs = {
    development: {
      host: env('DEV_DATABASE_HOST', 'localhost'),
      port: env.int('DEV_DATABASE_PORT', 5432),
      database: env('DEV_DATABASE_NAME', 'blog_cms'),
      user: env('DEV_DATABASE_USERNAME', 'postgres'),
      password: env('DEV_DATABASE_PASSWORD', ''),
      ssl: getSSLConfig('DEV_DATABASE_SSL', 'false'),
    },
    
    staging: {
      host: env('STAGING_DATABASE_HOST'),
      port: env.int('STAGING_DATABASE_PORT', 5432),
      database: env('STAGING_DATABASE_NAME'),
      user: env('STAGING_DATABASE_USERNAME'),
      password: env('STAGING_DATABASE_PASSWORD'),
      ssl: getSSLConfig('STAGING_DATABASE_SSL', 'true'),
    },
    
    production: {
      host: env('PROD_DATABASE_HOST'),
      port: env.int('PROD_DATABASE_PORT', 5432),
      database: env('PROD_DATABASE_NAME'),
      user: env('PROD_DATABASE_USERNAME'),
      password: env('PROD_DATABASE_PASSWORD'),
      ssl: getSSLConfig('PROD_DATABASE_SSL', 'true'),
    }
  };

  // Get configuration for current environment
  const dbConfig = databaseConfigs[appEnv as keyof typeof databaseConfigs] || databaseConfigs.development;
  
  const config = {
    connection: {
      client: 'postgres',
      connection: {
        ...dbConfig,
        schema: env('DATABASE_SCHEMA', 'public'),
      },
    },
  };
  
  // Log current environment info (only in development)
  if (appEnv === 'development') {
    console.log(`🗄️  Database: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
  }
  
  console.log('🔧 Final database config:', JSON.stringify({
    connection: {
      client: config.connection.client,
      connection: {
        ...config.connection.connection,
        password: '***REDACTED***'
      }
    }
  }, null, 2));
  
  return config;
};
