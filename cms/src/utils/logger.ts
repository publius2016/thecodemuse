import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Get environment variables
const nodeEnv = process.env.NODE_ENV || 'development';
const logLevel = process.env.LOG_LEVEL || (nodeEnv === 'production' ? 'info' : 'debug');
const logDir = process.env.LOG_DIR || path.join(process.cwd(), 'logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDir)) {
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

// Create logger instance
const logger = winston.createLogger({
  level: logLevel,
  format: jsonLogFormat,
  defaultMeta: {
    service: 'strapi-cms',
    environment: nodeEnv
  },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: consoleFormat
    }),
    
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
      filename: path.join(logDir, 'strapi.log'),
      format: jsonLogFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 10
    })
  ],
  
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log'),
      format: jsonLogFormat
    })
  ],
  
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log'),
      format: jsonLogFormat
    })
  ]
});

/**
 * Structured logger wrapper for Strapi
 * Provides structured JSON logging with request ID support
 */
export class StructuredLogger {
  private strapiLogger: any;
  private requestId?: string;

  constructor(strapiLogger: any, requestId?: string) {
    this.strapiLogger = strapiLogger;
    this.requestId = requestId;
  }

  /**
   * Create a child logger with request ID context
   */
  child(requestId: string): StructuredLogger {
    return new StructuredLogger(this.strapiLogger, requestId);
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
    this.strapiLogger?.debug?.(message, meta);
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
    this.strapiLogger?.info?.(message, meta);
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
    this.strapiLogger?.warn?.(message, meta);
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
    this.strapiLogger?.error?.(message, meta);
  }
}

/**
 * Create structured logger instance
 */
export const createStructuredLogger = (strapiLogger?: any, requestId?: string): StructuredLogger => {
  return new StructuredLogger(strapiLogger, requestId);
};

/**
 * Generate or extract request ID from headers
 */
export const getRequestId = (headers: any): string => {
  return headers['x-request-id'] || headers['X-Request-ID'] || uuidv4();
};

export default logger;
