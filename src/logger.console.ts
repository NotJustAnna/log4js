import { Logger } from './logger';
import { dump, DumpOptions } from 'js-yaml';
import { LogLevel } from './logger.level';
import { functionHeader } from './functionHeader';

const { log: defaultStdout } = console;

/**
 * Plain console logger implementation that outputs to stdout.
 * 
 * @remarks
 * This logger formats messages with timestamps and log levels in plain text.
 * It uses YAML for formatting metadata objects and supports special magic tags
 * for code highlighting (although they are stripped in the plain console output).
 * 
 * Message format: `[HH:MM:SS] [name/LEVEL] message`
 * 
 * @public
 */
export class ConsoleLogger extends Logger {
  /**
   * Creates a new ConsoleLogger instance.
   * 
   * @param name - The name/identifier for this logger instance
   */
  constructor(readonly name: string) {
    super(name);
  }

  /**
   * Logs a message to stdout.
   * 
   * @param level - The severity level of the log message
   * @param msg - The message to log
   */
  log(level: LogLevel, msg: any): void;

  /**
   * Logs a message with metadata to stdout.
   * 
   * @param level - The severity level of the log message
   * @param msg - The message string to log
   * @param meta - Additional metadata to include
   */
  log(level: LogLevel, msg: string, meta: object): void;

  /**
   * Logs a message with optional metadata to stdout.
   * 
   * @param level - The severity level of the log message
   * @param msg - The message to log
   * @param meta - Optional metadata to include
   */
  log(level: LogLevel, msg: any, meta?: object): void {
    const now = new Date();
    const prefix = this.messagePrefix(level, now);
    if (typeof msg !== 'string') {
      ConsoleLogger.stdout(prefix + '\n' + this.handleMetadata(meta !== undefined ? { msg, ...meta } : { msg }));
      return;
    }
    if (meta !== undefined) {
      ConsoleLogger.stdout(prefix + ' ' + this.handleMessage(level, msg) + '\n' + this.handleMetadata(meta));
      return;
    }
    ConsoleLogger.stdout(prefix + ' ' + this.handleMessage(level, msg));
  }

  /**
   * Formats the message prefix with timestamp and log level.
   * 
   * @param level - The log level
   * @param now - The current timestamp
   * @returns Formatted prefix string
   * 
   * @protected
   */
  protected messagePrefix(level: LogLevel, now: Date) {
    return (
      '[' +
      now.getHours().toString().padStart(2, '0') +
      ':' +
      now.getMinutes().toString().padStart(2, '0') +
      ':' +
      now.getSeconds().toString().padStart(2, '0') +
      '] [' +
      this.name +
      '/' +
      level.toUpperCase() +
      ']'
    );
  }

  /**
   * Regular expression to match magic tags for code highlighting.
   * 
   * @remarks
   * Matches tags like `<hl language>code</hl>` or `<chalk style>text</chalk>`
   * 
   * @protected
   */
  protected static readonly magicTagRegExp = /<(hl|chalk) +([\w-]+) *>([\s\S]+?)<\/\1 *>/g;

  /**
   * Processes the log message, stripping magic tags in plain console output.
   * 
   * @param level - The log level
   * @param msg - The message string
   * @returns Processed message string
   * 
   * @protected
   */
  protected handleMessage(level: LogLevel, msg: string) {
    return msg.replace(ConsoleLogger.magicTagRegExp, '$2');
  }

  /**
   * Formats metadata object as YAML with indentation.
   * 
   * @param obj - The metadata object to format
   * @returns Formatted YAML string with proper indentation
   * 
   * @protected
   */
  protected handleMetadata(obj: object) {
    return dump(obj, ConsoleLogger.yamlDumpOptions)
      .split('\n')
      .map((v) => `  ${v}`)
      .join('\n')
      .trimEnd()
      .replace(ConsoleLogger.magicTagRegExp, '$2');
  }

  /**
   * Options for YAML serialization of metadata.
   * 
   * @remarks
   * Includes custom replacer to handle Error objects, functions, and BigInt values.
   * 
   * @protected
   */
  protected static readonly yamlDumpOptions: DumpOptions = {
    lineWidth: 120,
    quotingType: '"',
    skipInvalid: true,
    replacer: (_, value: any) => {
      if (!(value instanceof Error)) {
        if (typeof value === 'function') {
          return `<hl js>${functionHeader(value)}</hl>`;
        } else if (typeof value === 'bigint') {
          return value.toString();
        } else {
          return value;
        }
      }

      const error: any = {};
      Object.getOwnPropertyNames(value).forEach((key) => {
        error[key] = (value as any)[key];
      });
      return error;
    },
  };

  /**
   * Output function for writing to stdout.
   * 
   * @remarks
   * Can be replaced for testing or custom output handling.
   * 
   * @public
   */
  public static stdout: (arg: string) => void = defaultStdout;
}
