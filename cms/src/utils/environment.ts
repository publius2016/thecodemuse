/**
 * Environment Configuration Utility
 * 
 * This utility provides environment-specific configurations
 * that can be used across services and config files
 */

export interface EnvironmentConfig {
  environment: string;
  database: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl: boolean;
  };
  email: {
    serviceUrl: string;
    apiKey: string;
    timeout: number;
  };
  frontend: {
    url: string;
  };
  strapi: {
    host: string;
    port: number;
  };
}

export const getEnvironmentConfig = (): EnvironmentConfig => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  const configs = {
    development: {
      database: {
        host: process.env.DEV_DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DEV_DATABASE_PORT || '5432'),
        database: process.env.DEV_DATABASE_NAME || 'blog_cms',
        username: process.env.DEV_DATABASE_USERNAME || 'postgres',
        password: process.env.DEV_DATABASE_PASSWORD || '',
        ssl: false,
      },
      email: {
        serviceUrl: process.env.DEV_EMAIL_SERVICE_URL || 'http://localhost:3030',
        apiKey: process.env.DEV_EMAIL_SERVICE_API_KEY || 'dev-api-key',
        timeout: parseInt(process.env.DEV_EMAIL_SERVICE_TIMEOUT || '10000'),
      },
      frontend: {
        url: process.env.DEV_FRONTEND_URL || 'http://localhost:3000',
      },
      strapi: {
        host: process.env.DEV_STRAPI_HOST || '0.0.0.0',
        port: parseInt(process.env.DEV_STRAPI_PORT || '1337'),
      }
    },
    
    staging: {
      database: {
        host: process.env.STAGING_DATABASE_HOST!,
        port: parseInt(process.env.STAGING_DATABASE_PORT || '5432'),
        database: process.env.STAGING_DATABASE_NAME!,
        username: process.env.STAGING_DATABASE_USERNAME!,
        password: process.env.STAGING_DATABASE_PASSWORD!,
        ssl: (process.env.STAGING_DATABASE_SSL || 'true') === 'true',
      },
      email: {
        serviceUrl: process.env.STAGING_EMAIL_SERVICE_URL || 'https://staging-email.example.com',
        apiKey: process.env.STAGING_EMAIL_SERVICE_API_KEY || 'staging-api-key',
        timeout: parseInt(process.env.STAGING_EMAIL_SERVICE_TIMEOUT || '15000'),
      },
      frontend: {
        url: process.env.STAGING_FRONTEND_URL || 'https://staging.thecodemuse.com',
      },
      strapi: {
        host: process.env.STAGING_STRAPI_HOST || '0.0.0.0',
        port: parseInt(process.env.STAGING_STRAPI_PORT || '1337'),
      }
    },
    
    production: {
      database: {
        host: process.env.PROD_DATABASE_HOST!,
        port: parseInt(process.env.PROD_DATABASE_PORT || '5432'),
        database: process.env.PROD_DATABASE_NAME!,
        username: process.env.PROD_DATABASE_USERNAME!,
        password: process.env.PROD_DATABASE_PASSWORD!,
        ssl: (process.env.PROD_DATABASE_SSL || 'true') === 'true',
      },
      email: {
        serviceUrl: process.env.PROD_EMAIL_SERVICE_URL!,
        apiKey: process.env.PROD_EMAIL_SERVICE_API_KEY!,
        timeout: parseInt(process.env.PROD_EMAIL_SERVICE_TIMEOUT || '20000'),
      },
      frontend: {
        url: process.env.PROD_FRONTEND_URL || 'https://thecodemuse.com',
      },
      strapi: {
        host: process.env.PROD_STRAPI_HOST || '0.0.0.0',
        port: parseInt(process.env.PROD_STRAPI_PORT || '1337'),
      }
    }
  };

  const config = configs[nodeEnv as keyof typeof configs] || configs.development;
  
  // Log current environment (only in development)
  if (nodeEnv === 'development') {
    console.log(`🌍 Environment: ${nodeEnv.toUpperCase()}`);
    console.log(`📧 Email Service: ${config.email.serviceUrl}`);
    console.log(`🌐 Frontend: ${config.frontend.url}`);
  }

  return {
    environment: nodeEnv,
    ...config
  };
};

export default getEnvironmentConfig;
