import { Logger } from './logger';
import { dump, DumpOptions } from 'js-yaml';
import { LogLevel } from './logger.level';
import { functionHeader } from './functionHeader';

/**
 * Abstract base class for text-based loggers.
 * 
 * @remarks
 * This class provides common text formatting functionality for loggers that output
 * text-based messages (console, file, etc.). It handles message prefixing, metadata
 * formatting, and magic tag processing.
 * 
 * @public
 */
export abstract class TextBasedLogger extends Logger {
  /**
   * Creates a new TextBasedLogger instance.
   * 
   * @param name - The name/identifier for this logger instance
   */
  protected constructor(readonly name: string) {
    super(name);
  }

  /**
   * Writes a formatted log message to the output destination.
   * 
   * @param message - The formatted message to write
   * 
   * @protected
   */
  protected abstract writeOutput(message: string): void;

  /**
   * Logs a message to the output.
   * 
   * @param level - The severity level of the log message
   * @param msg - The message to log
   */
  protected logInternal(level: LogLevel, msg: any): void;

  /**
   * Logs a message with metadata to the output.
   * 
   * @param level - The severity level of the log message
   * @param msg - The message string to log
   * @param meta - Additional metadata to include
   */
  protected logInternal(level: LogLevel, msg: string, meta: object): void;

  /**
   * Logs a message with optional metadata to the output.
   * 
   * @param level - The severity level of the log message
   * @param msg - The message to log
   * @param meta - Optional metadata to include
   */
  protected logInternal(level: LogLevel, msg: any, meta?: object): void {
    const now = new Date();
    const prefix = this.messagePrefix(level, now);
    if (typeof msg !== 'string') {
      this.writeOutput(prefix + '\n' + this.handleMetadata(meta !== undefined ? { msg, ...meta } : { msg }));
      return;
    }
    if (meta !== undefined) {
      this.writeOutput(prefix + ' ' + this.handleMessage(level, msg) + '\n' + this.handleMetadata(meta));
      return;
    }
    this.writeOutput(prefix + ' ' + this.handleMessage(level, msg));
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
   * Processes the log message, stripping magic tags in plain text output.
   * 
   * @param level - The log level
   * @param msg - The message string
   * @returns Processed message string
   * 
   * @protected
   */
  protected handleMessage(level: LogLevel, msg: string) {
    return msg.replace(TextBasedLogger.magicTagRegExp, '$3');
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
    return dump(obj, TextBasedLogger.yamlDumpOptions)
      .split('\n')
      .map((v) => `  ${v}`)
      .join('\n')
      .trimEnd()
      .replace(TextBasedLogger.magicTagRegExp, '$3');
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
}
