/**
 * Represents the severity level of a log message.
 *
 * @remarks
 * Log levels are used to categorize log messages by their importance:
 * - `debug`: Detailed diagnostic information for debugging purposes
 * - `info`: General informational messages about application flow
 * - `warn`: Warning messages for potentially problematic situations
 * - `error`: Error messages for serious problems that need attention
 *
 * @public
 */
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';
