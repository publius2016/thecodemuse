import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Get environment variables
const nodeEnv = process.env.NODE_ENV || 'development';
const logLevel = process.env.NEXT_PUBLIC_LOG_LEVEL || process.env.LOG_LEVEL || (nodeEnv === 'production' ? 'info' : 'debug');
const logDir = process.env.LOG_DIR || path.join(process.cwd(), 'logs');

// Create logs directory if it doesn't exist (server-side only)
if (typeof window === 'undefined' && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Define structured JSON log format
const jsonLogFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define console format (human-readable in development, JSON in production)
const consoleFormat = nodeEnv === 'production'
  ? jsonLogFormat
  : winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, requestId, ...meta }) => {
        const requestIdStr = requestId ? `[${requestId}]` : '';
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta, null, 2)}` : '';
        return `${timestamp} ${requestIdStr} [${level}]: ${message}${metaStr}`;
      })
    );

// Create transports array
const transports: winston.transport[] = [
  // Console transport (always available)
  new winston.transports.Console({
    format: consoleFormat
  })
];

// Add file transports only on server-side
if (typeof window === 'undefined') {
  transports.push(
    // File transport for errors (JSON format)
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: jsonLogFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // File transport for all logs (JSON format)
    new winston.transports.File({
      filename: path.join(logDir, 'frontend.log'),
      format: jsonLogFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 10
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: logLevel,
  format: jsonLogFormat,
  defaultMeta: {
    service: 'nextjs-frontend',
    environment: nodeEnv
  },
  transports,
  
  // Handle uncaught exceptions (server-side only)
  ...(typeof window === 'undefined' && {
    exceptionHandlers: [
      new winston.transports.File({
        filename: path.join(logDir, 'exceptions.log'),
        format: jsonLogFormat
      })
    ],
    rejectionHandlers: [
      new winston.transports.File({
        filename: path.join(logDir, 'rejections.log'),
        format: jsonLogFormat
      })
    ]
  })
});

/**
 * Create a child logger with request ID context
 * This ensures all logs for a request include the request ID
 */
export const createRequestLogger = (requestId: string) => {
  return logger.child({ requestId });
};

/**
 * Generate or extract request ID from headers
 */
export const getRequestId = (headers: Headers | Record<string, string | string[] | undefined>): string => {
  if (headers instanceof Headers) {
    return headers.get('x-request-id') || headers.get('X-Request-ID') || uuidv4();
  }
  const requestId = headers['x-request-id'] || headers['X-Request-ID'];
  if (typeof requestId === 'string') {
    return requestId;
  }
  if (Array.isArray(requestId) && requestId.length > 0) {
    return requestId[0];
  }
  return uuidv4();
};

/**
 * Structured logger with request ID support
 */
export class StructuredLogger {
  private requestId?: string;

  constructor(requestId?: string) {
    this.requestId = requestId;
  }

  /**
   * Create a child logger with request ID context
   */
  child(requestId: string): StructuredLogger {
    return new StructuredLogger(requestId);
  }

  /**
   * Log debug message
   */
  debug(message: string, meta?: any): void {
    const logData = {
      ...meta,
      ...(this.requestId && { requestId: this.requestId })
    };
    logger.debug(message, logData);
  }

  /**
   * Log info message
   */
  info(message: string, meta?: any): void {
    const logData = {
      ...meta,
      ...(this.requestId && { requestId: this.requestId })
    };
    logger.info(message, logData);
  }

  /**
   * Log warning message
   */
  warn(message: string, meta?: any): void {
    const logData = {
      ...meta,
      ...(this.requestId && { requestId: this.requestId })
    };
    logger.warn(message, logData);
  }

  /**
   * Log error message
   */
  error(message: string, meta?: any): void {
    const logData = {
      ...meta,
      ...(this.requestId && { requestId: this.requestId })
    };
    logger.error(message, logData);
  }
}

/**
 * Create structured logger instance
 */
export const createStructuredLogger = (requestId?: string): StructuredLogger => {
  return new StructuredLogger(requestId);
};

// Export default logger
export default logger;
