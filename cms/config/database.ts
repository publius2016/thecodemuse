import path from 'path';
import { getEnvironmentConfig } from './environment';

export default ({ env }) => {
  const client = env('DATABASE_CLIENT', 'postgres');
  const envConfig = getEnvironmentConfig();

  const connections = {
    postgres: {
      connection: {
        connectionString: env('DATABASE_URL'),
        host: envConfig.database.host,
        port: envConfig.database.port,
        database: envConfig.database.database,
        user: envConfig.database.username,
        password: envConfig.database.password,
        ssl: envConfig.database.ssl ? {
          rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false),
        } : false,
        schema: env('DATABASE_SCHEMA', 'public'),
      },
      pool: { 
        min: env.int('DATABASE_POOL_MIN', 2), 
        max: env.int('DATABASE_POOL_MAX', 10),
        acquireTimeoutMillis: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 200,
      },
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};

