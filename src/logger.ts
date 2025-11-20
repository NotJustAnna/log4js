import { LogLevel, parseLogLevel, shouldLog } from './logger.level';
import * as process from 'process';

/**
 * Abstract base class for all logger implementations.
 * 
 * @remarks
 * This class provides a common interface for different logging backends.
 * Concrete implementations must provide the `log` method, while this class
 * provides convenience methods for each log level (info, warn, error, debug).
 * 
 * Log level filtering is applied based on the LOG4JS_LEVEL environment variable.
 * Only messages at or above the configured level will be logged.
 * 
 * @public
 */
export abstract class Logger {
  /**
   * The minimum log level to output, parsed from LOG4JS_LEVEL env var.
   * Defaults to 'info' if not specified.
   */
  protected readonly minLevel: LogLevel;

  /**
   * Creates a new Logger instance.
   * 
   * @param name - The name/identifier for this logger instance
   */
  protected constructor(readonly name: string) {
    this.minLevel = parseLogLevel(process.env.LOG4JS_LEVEL);
  }

  /**
   * Logs a message with the specified level.
   * 
   * @param level - The severity level of the log message
   * @param msg - The message to log (can be any type)
   * 
   * @remarks
   * This is the core logging method that must be implemented by all concrete logger classes.
   * The implementation should NOT perform level filtering - that is handled by this base class.
   */
  protected abstract logInternal(level: LogLevel, msg: any): void;

  /**
   * Logs a string message with metadata at the specified level.
   * 
   * @param level - The severity level of the log message
   * @param msg - The message string to log
   * @param meta - Additional metadata to include with the log entry
   */
  protected abstract logInternal(level: LogLevel, msg: string, meta: object): void;

  /**
   * Logs a message with optional metadata at the specified level.
   * 
   * @param level - The severity level of the log message
   * @param msg - The message to log (can be any type)
   * @param meta - Optional metadata to include with the log entry
   */
  protected abstract logInternal(level: LogLevel, msg: any, meta?: object): void;

  /**
   * Logs a message with the specified level (with filtering).
   * 
   * @param level - The severity level of the log message
   * @param msg - The message to log (can be any type)
   */
  log(level: LogLevel, msg: any): void;

  /**
   * Logs a string message with metadata at the specified level (with filtering).
   * 
   * @param level - The severity level of the log message
   * @param msg - The message string to log
   * @param meta - Additional metadata to include with the log entry
   */
  log(level: LogLevel, msg: string, meta: object): void;

  /**
   * Logs a message with optional metadata at the specified level (with filtering).
   * 
   * @param level - The severity level of the log message
   * @param msg - The message to log (can be any type)
   * @param meta - Optional metadata to include with the log entry
   */
  log(level: LogLevel, msg: any, meta?: object): void {
    if (shouldLog(level, this.minLevel)) {
      this.logInternal(level, msg, meta);
    }
  }

  /**
   * Logs an informational message.
   * 
   * @param msg - The message to log
   */
  info(msg: any): void;

  /**
   * Logs an informational message with metadata.
   * 
   * @param msg - The message string to log
   * @param meta - Additional metadata to include
   */
  info(msg: string, meta: object): void;

  /**
   * Logs an informational message with optional metadata.
   * 
   * @param msg - The message to log
   * @param meta - Optional metadata to include
   */
  info(msg: any, meta?: object): void {
    this.log('info', msg, meta);
  }

  /**
   * Logs a warning message.
   * 
   * @param msg - The message to log
   */
  warn(msg: any): void;

  /**
   * Logs a warning message with metadata.
   * 
   * @param msg - The message string to log
   * @param meta - Additional metadata to include
   */
  warn(msg: string, meta: object): void;

  /**
   * Logs a warning message with optional metadata.
   * 
   * @param msg - The message to log
   * @param meta - Optional metadata to include
   */
  warn(msg: any, meta?: object): void {
    this.log('warn', msg, meta);
  }

  /**
   * Logs an error message.
   * 
   * @param msg - The message to log
   */
  error(msg: any): void;

  /**
   * Logs an error message with metadata.
   * 
   * @param msg - The message string to log
   * @param meta - Additional metadata to include
   */
  error(msg: string, meta: object): void;

  /**
   * Logs an error message with optional metadata.
   * 
   * @param msg - The message to log
   * @param meta - Optional metadata to include
   */
  error(msg: any, meta?: object): void {
    this.log('error', msg, meta);
  }

  /**
   * Logs a debug message.
   * 
   * @param msg - The message to log
   */
  debug(msg: any): void;

  /**
   * Logs a debug message with metadata.
   * 
   * @param msg - The message string to log
   * @param meta - Additional metadata to include
   */
  debug(msg: string, meta: object): void;

  /**
   * Logs a debug message with optional metadata.
   * 
   * @param msg - The message to log
   * @param meta - Optional metadata to include
   */
  debug(msg: any, meta?: object): void {
    this.log('debug', msg, meta);
  }
}
