import { Logger } from './logger';
import * as process from 'process';
import { ColorfulConsoleLogger } from './logger.console.colorful';
import { ConsoleLogger } from './logger.console';
import chalk from 'chalk';
import { LambdaLogger } from './logger.lambda';
import { FileLogger } from './logger.file';
import { DelegateLogger } from './logger.delegate';

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
 * - `file` - File logger (with optional console output)
 * 
 * **File Logging:**
 * - If `LOG4JS_FILE` is set, file logging is enabled regardless of mode
 * - If `LOG4JS_MODE` contains `file`, file logging is enabled
 * - File logger can be combined with console output (e.g., `LOG4JS_MODE=colorful,file`)
 * - Default log file is `latest.log` if `LOG4JS_FILE` is not specified
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
 * 
 * // File logging
 * // LOG4JS_FILE=app.log node app.js
 * // LOG4JS_MODE=file node app.js (uses latest.log)
 * // LOG4JS_MODE=colorful,file LOG4JS_FILE=app.log node app.js (both console and file)
 * ```
 * 
 * @public
 */
export function log4js(name: string): Logger {
  const modes = process.env.LOG4JS_MODE?.toLowerCase().split(',').map(m => m.trim()) || [];
  const hasFileEnv = process.env.LOG4JS_FILE !== undefined;
  const hasFileMode = modes.includes('file');
  const shouldLogToFile = hasFileEnv || hasFileMode;
  
  let consoleLogger: Logger | null;
  
  // Determine the console logger type
  function pickLoggerForMode(mode: string | undefined, name: string): Logger {
    switch (mode) {
      case 'lambda':
      case 'aws':
      case 'cloudwatch':
        return createLambdaLogger(name);
      case 'cli/colorful':
      case 'colorful':
      case 'cli/color':
      case 'color':
        return createColorfulConsoleLogger(name);
      case 'cli/plain':
      case 'plain':
      case 'cli/text':
      case 'text':
      case 'cli/plaintext':
      case 'plaintext':
        return createConsoleLogger(name);
      case 'cli':
      case 'console':
        return chalk.supportsColor ? createColorfulConsoleLogger(name) : createConsoleLogger(name);
      default:
        // Unknown mode -> auto-detect color support
        return chalk.supportsColor ? createColorfulConsoleLogger(name) : createConsoleLogger(name);
    }
  }

  if (modes.length > 0 && !hasFileMode) {
    // User defined LOG4JS_MODE but not including 'file'
    consoleLogger = pickLoggerForMode(modes[0], name);
  } else if (hasFileMode) {
    // User specified file mode, determine console type from other modes or auto-detect
    const nonFileModes = modes.filter(m => m !== 'file');
    if (nonFileModes.length > 0) {
      consoleLogger = pickLoggerForMode(nonFileModes[0], name);
    } else {
      // Only 'file' mode specified, auto-detect console type
      consoleLogger = chalk.supportsColor ? createColorfulConsoleLogger(name) : createConsoleLogger(name);
    }
  } else {
    // No LOG4JS_MODE defined, auto-detect environment
    if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
      consoleLogger = createLambdaLogger(name);
    } else {
      consoleLogger = chalk.supportsColor ? createColorfulConsoleLogger(name) : createConsoleLogger(name);
    }
  }
  
  // If file logging is enabled, create a delegate logger
  if (shouldLogToFile) {
    const fileLogger = createFileLogger(name);
    return new DelegateLogger(name, [consoleLogger, fileLogger]);
  }
  
  return consoleLogger;
}

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
export function createConsoleLogger(name: string): Logger {
  return new ConsoleLogger(name);
}

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
export function createColorfulConsoleLogger(name: string): Logger {
  return new ColorfulConsoleLogger(name);
}

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
export function createLambdaLogger(name: string): Logger {
  return new LambdaLogger(name);
}

/**
 * Creates a file logger instance.
 * 
 * @param name - The name/identifier for the logger instance
 * @returns A FileLogger instance that outputs to a file
 * 
 * @remarks
 * The log file path is determined by the LOG4JS_FILE environment variable,
 * defaulting to 'latest.log' if not specified.
 * 
 * File loggers use a static file handle to avoid opening multiple handles
 * to the same file.
 * 
 * @example
 * ```typescript
 * // LOG4JS_FILE=app.log
 * const logger = createFileLogger('MyService');
 * logger.info('This will be written to app.log');
 * ```
 * 
 * @public
 */
export function createFileLogger(name: string): Logger {
  return new FileLogger(name);
}
