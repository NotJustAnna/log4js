import { Logger } from './logger';
/**
 * Creates a logger instance with automatic environment detection.
 *
 * @param name - The name/identifier for the logger instance
 * @returns A Logger instance appropriate for the current environment
 *
 * @remarks
 * This is the main entry point for creating loggers. It automatically detects
 * the best logger type based on the environment:
 *
 * **Environment Detection Priority:**
 * 1. If `LOG4JS_MODE` environment variable is set, uses the specified mode
 * 2. If `AWS_LAMBDA_FUNCTION_NAME` is set, uses LambdaLogger
 * 3. If terminal supports color, uses ColorfulConsoleLogger
 * 4. Otherwise, uses plain ConsoleLogger
 *
 * **Supported LOG4JS_MODE values:**
 * - `lambda`, `aws`, `cloudwatch` - AWS Lambda logger
 * - `colorful`, `color`, `cli/colorful`, `cli/color` - Colorful console logger
 * - `plain`, `text`, `plaintext`, `cli/plain`, `cli/text`, `cli/plaintext` - Plain console logger
 * - `cli`, `console` - Auto-detect color support
 *
 * @example
 * ```typescript
 * // Basic usage
 * const logger = log4js('MyApp');
 * logger.info('Application started');
 *
 * // With metadata
 * logger.info('User logged in', { userId: 123, username: 'john' });
 *
 * // Different log levels
 * logger.debug('Debug information');
 * logger.warn('Warning message');
 * logger.error('Error occurred', { error: err });
 * ```
 *
 * @public
 */
export declare function log4js(name: string): Logger;
/**
 * Creates a plain console logger instance.
 *
 * @param name - The name/identifier for the logger instance
 * @returns A ConsoleLogger instance that outputs plain text to stdout
 *
 * @remarks
 * Use this when you need a plain text logger without colors or syntax highlighting.
 * Useful for environments that don't support ANSI colors or when piping output.
 *
 * @example
 * ```typescript
 * const logger = createConsoleLogger('MyService');
 * logger.info('This will be plain text');
 * ```
 *
 * @public
 */
export declare function createConsoleLogger(name: string): Logger;
/**
 * Creates a colorful console logger with syntax highlighting.
 *
 * @param name - The name/identifier for the logger instance
 * @returns A ColorfulConsoleLogger instance with color and highlighting support
 *
 * @remarks
 * This logger provides:
 * - Colored timestamps and log levels
 * - YAML syntax highlighting for metadata
 * - Support for embedded code highlighting via magic tags
 * - Chalk-based text formatting
 *
 * @example
 * ```typescript
 * const logger = createColorfulConsoleLogger('MyService');
 * logger.info('User action', {
 *   query: '<hl sql>SELECT * FROM users WHERE id = 1</hl>',
 *   status: '<chalk green>success</chalk>'
 * });
 * ```
 *
 * @public
 */
export declare function createColorfulConsoleLogger(name: string): Logger;
/**
 * Creates an AWS Lambda-optimized logger.
 *
 * @param name - The name/identifier for the logger instance (used as a tag)
 * @returns A LambdaLogger instance optimized for AWS CloudWatch
 *
 * @remarks
 * This logger formats output as JSON for optimal parsing in AWS CloudWatch Logs.
 * It's automatically selected when running in AWS Lambda environments.
 *
 * @example
 * ```typescript
 * // In AWS Lambda
 * const logger = createLambdaLogger('MyLambdaFunction');
 * logger.info('Processing event', { eventId: context.requestId });
 * ```
 *
 * @public
 */
export declare function createLambdaLogger(name: string): Logger;
