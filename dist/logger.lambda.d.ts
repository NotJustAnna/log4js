import { Logger } from './logger';
import { LogLevel } from './logger.level';
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
export declare class LambdaLogger extends Logger {
    readonly name: string;
    /**
     * Creates a new LambdaLogger instance.
     *
     * @param name - The name/identifier for this logger instance (used as a tag)
     */
    constructor(name: string);
    private static warnedAboutMissingLambdaLog;
    /**
     * Logs a message to AWS CloudWatch via lambda-log.
     *
     * @param level - The severity level of the log message
     * @param msg - The message to log
     */
    log(level: LogLevel, msg: any): void;
    /**
     * Logs a message with metadata to AWS CloudWatch.
     *
     * @param level - The severity level of the log message
     * @param msg - The message string to log
     * @param meta - Additional metadata to include
     */
    log(level: LogLevel, msg: string, meta: object): void;
}
