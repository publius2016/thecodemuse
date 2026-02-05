import { getRequestId } from '../utils/logger';

/**
 * Middleware to add request ID to all requests
 * This enables tracing requests across the CMS
 */
export default (config: any, { strapi }: any) => {
  return async (ctx: any, next: () => Promise<any>) => {
    // Generate or extract request ID
    const requestId = getRequestId(ctx.request.headers);
    
    // Add request ID to context
    ctx.request.requestId = requestId;
    ctx.state.requestId = requestId;
    
    // Set response header
    ctx.set('X-Request-ID', requestId);
    
    // Enhance strapi.log with request ID context
    const originalLog = strapi.log;
    ctx.state.logger = {
      ...originalLog,
      debug: (message: string, meta?: any) => {
        originalLog.debug(message, { ...meta, requestId });
      },
      info: (message: string, meta?: any) => {
        originalLog.info(message, { ...meta, requestId });
      },
      warn: (message: string, meta?: any) => {
        originalLog.warn(message, { ...meta, requestId });
      },
      error: (message: string, meta?: any) => {
        originalLog.error(message, { ...meta, requestId });
      }
    };
    
    await next();
  };
};
