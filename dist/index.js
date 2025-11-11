"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log4js = log4js;
exports.createConsoleLogger = createConsoleLogger;
exports.createColorfulConsoleLogger = createColorfulConsoleLogger;
exports.createLambdaLogger = createLambdaLogger;
const process = __importStar(require("process"));
const logger_console_colorful_1 = require("./logger.console.colorful");
const logger_console_1 = require("./logger.console");
const chalk_1 = __importDefault(require("chalk"));
const logger_lambda_1 = require("./logger.lambda");
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
function log4js(name) {
    // The user defined the LOG4JS_MODE environment variable
    if (process.env.LOG4JS_MODE) {
        switch (process.env.LOG4JS_MODE.toLowerCase()) {
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
            default:
                if (chalk_1.default.supportsColor) {
                    return createColorfulConsoleLogger(name);
                }
                else {
                    return createConsoleLogger(name);
                }
        }
    }
    // The user did not define the LOG4JS_MODE environment variable
    // We will try to detect the environment
    if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
        return createLambdaLogger(name);
    }
    if (chalk_1.default.supportsColor) {
        return createColorfulConsoleLogger(name);
    }
    return createConsoleLogger(name);
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
function createConsoleLogger(name) {
    return new logger_console_1.ConsoleLogger(name);
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
function createColorfulConsoleLogger(name) {
    return new logger_console_colorful_1.ColorfulConsoleLogger(name);
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
function createLambdaLogger(name) {
    return new logger_lambda_1.LambdaLogger(name);
}
//# sourceMappingURL=index.js.map