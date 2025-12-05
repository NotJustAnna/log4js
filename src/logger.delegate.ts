import { Logger } from './logger';
import { LogLevel } from './logger.level';

/**
 * Delegate logger that forwards log messages to multiple logger instances.
 * 
 * @remarks
 * This logger acts as a multiplexer, forwarding all log calls to an array
 * of underlying loggers. This allows logging to multiple destinations
 * simultaneously (e.g., console and file).
 * 
 * @public
 */
export class DelegateLogger extends Logger {
  /**
   * Creates a new DelegateLogger instance.
   * 
   * @param name - The name/identifier for this logger instance
   * @param loggers - Array of loggers to delegate to
   */
  constructor(readonly name: string, private readonly loggers: Logger[]) {
    super(name);
  }

  /**
   * Logs a message to all delegate loggers.
   * 
   * @param level - The severity level of the log message
   * @param msg - The message to log
   */
  protected logInternal(level: LogLevel, msg: any): void;

  /**
   * Logs a message with metadata to all delegate loggers.
   * 
   * @param level - The severity level of the log message
   * @param msg - The message string to log
   * @param meta - Additional metadata to include
   */
  protected logInternal(level: LogLevel, msg: string, meta: object): void;

  /**
   * Logs a message with optional metadata to all delegate loggers.
   * 
   * @param level - The severity level of the log message
   * @param msg - The message to log
   * @param meta - Optional metadata to include
   */
  protected logInternal(level: LogLevel, msg: any, meta?: object): void {
    for (const logger of this.loggers) {
      logger.log(level, msg, meta);
    }
  }
}
