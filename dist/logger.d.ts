import { LogLevel } from './logger.level';
/**
 * Abstract base class for all logger implementations.
 *
 * @remarks
 * This class provides a common interface for different logging backends.
 * Concrete implementations must provide the `log` method, while this class
 * provides convenience methods for each log level (info, warn, error, debug).
 *
 * @public
 */
export declare abstract class Logger {
    readonly name: string;
    /**
     * Creates a new Logger instance.
     *
     * @param name - The name/identifier for this logger instance
     */
    protected constructor(name: string);
    /**
     * Logs a message with the specified level.
     *
     * @param level - The severity level of the log message
     * @param msg - The message to log (can be any type)
     *
     * @remarks
     * This is the core logging method that must be implemented by all concrete logger classes.
     */
    abstract log(level: LogLevel, msg: any): void;
    /**
     * Logs a string message with metadata at the specified level.
     *
     * @param level - The severity level of the log message
     * @param msg - The message string to log
     * @param meta - Additional metadata to include with the log entry
     */
    abstract log(level: LogLevel, msg: string, meta: object): void;
    /**
     * Logs a message with optional metadata at the specified level.
     *
     * @param level - The severity level of the log message
     * @param msg - The message to log (can be any type)
     * @param meta - Optional metadata to include with the log entry
     */
    abstract log(level: LogLevel, msg: any, meta?: object): void;
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
}
