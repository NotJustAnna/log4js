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

/**
 * Numeric priority values for log levels, used for filtering.
 * Lower numbers mean higher priority (less verbose).
 * 
 * @internal
 */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

/**
 * Checks if a log message should be logged based on the configured minimum level.
 * 
 * @param messageLevel - The level of the message being logged
 * @param minLevel - The minimum level to log (from LOG4JS_LEVEL env var, defaults to 'info')
 * @returns true if the message should be logged, false otherwise
 * 
 * @remarks
 * Messages are logged if their priority is equal to or higher than the minimum level.
 * Priority order (highest to lowest): error > warn > info > debug
 * 
 * @public
 */
export function shouldLog(messageLevel: LogLevel, minLevel: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[messageLevel] <= LOG_LEVEL_PRIORITY[minLevel];
}

/**
 * Parses the LOG4JS_LEVEL environment variable and returns a valid LogLevel.
 * 
 * @param envValue - The value from process.env.LOG4JS_LEVEL
 * @returns A valid LogLevel, defaults to 'info' if invalid or undefined
 * 
 * @public
 */
export function parseLogLevel(envValue: string | undefined): LogLevel {
  if (!envValue) {
    return 'info';
  }
  
  const normalized = envValue.toLowerCase().trim() as LogLevel;
  if (normalized === 'debug' || normalized === 'info' || normalized === 'warn' || normalized === 'error') {
    return normalized;
  }
  
  return 'info';
}
