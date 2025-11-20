import { Logger } from './logger';
import { LogLevel } from './logger.level';

let lambdaLog: any = null;
let lambdaLogError: Error | null = null;

try {
  lambdaLog = require('lambda-log');
} catch (err) {
  lambdaLogError = err as Error;
}

/**
 * AWS Lambda-optimized logger implementation.
 * 
 * @remarks
 * This logger uses the lambda-log library to format log messages in a way
 * that's optimized for AWS CloudWatch Logs. It automatically structures logs
 * as JSON and includes appropriate metadata for Lambda function contexts.
 * 
 * If lambda-log is not installed, this logger falls back to JSON console output.
 * 
 * Features:
 * - JSON-structured logging for CloudWatch
 * - Automatic metadata inclusion
 * - Lambda-specific formatting
 * - Tags support for log organization
 * 
 * @public
 */
export class LambdaLogger extends Logger {
  /**
   * Creates a new LambdaLogger instance.
   * 
   * @param name - The name/identifier for this logger instance (used as a tag)
   */
  constructor(readonly name: string) {
    super(name);
    if (lambdaLogError && !LambdaLogger.warnedAboutMissingLambdaLog) {
      console.warn('[log4js] lambda-log is not installed, falling back to JSON console output. Install lambda-log for full functionality.');
      LambdaLogger.warnedAboutMissingLambdaLog = true;
    }
  }

  private static warnedAboutMissingLambdaLog = false;

  /**
   * Logs a message to AWS CloudWatch via lambda-log.
   * 
   * @param level - The severity level of the log message
   * @param msg - The message to log
   */
  protected logInternal(level: LogLevel, msg: any): void;

  /**
   * Logs a message with metadata to AWS CloudWatch.
   * 
   * @param level - The severity level of the log message
   * @param msg - The message string to log
   * @param meta - Additional metadata to include
   */
  protected logInternal(level: LogLevel, msg: string, meta: object): void;

  /**
   * Logs a message with optional metadata to AWS CloudWatch.
   * 
   * @param level - The severity level of the log message
   * @param msg - The message to log
   * @param meta - Optional metadata to include
   */
  protected logInternal(level: LogLevel, msg: any, meta?: object): void {
    if (lambdaLog) {
      if (typeof msg !== 'string') {
        const logMeta = meta === undefined ? { msg } : { msg, ...meta };
        lambdaLog.log(level, undefined as any, logMeta, [this.name]);
        return;
      }
      const logMeta = meta === undefined ? {} : meta;
      lambdaLog.log(level, msg, logMeta, [this.name]);
    } else {
      const logObj: any = {
        _logLevel: level,
        _tags: [this.name],
        msg: typeof msg === 'string' ? msg : undefined
      };
      if (typeof msg !== 'string') {
        Object.assign(logObj, { msg }, meta);
      } else if (meta) {
        Object.assign(logObj, meta);
      }
      console.log(JSON.stringify(logObj));
    }
  }
}
