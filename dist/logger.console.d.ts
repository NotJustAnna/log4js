import { Logger } from './logger';
import { DumpOptions } from 'js-yaml';
import { LogLevel } from './logger.level';
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
export declare class ConsoleLogger extends Logger {
    readonly name: string;
    /**
     * Creates a new ConsoleLogger instance.
     *
     * @param name - The name/identifier for this logger instance
     */
    constructor(name: string);
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
     * Formats the message prefix with timestamp and log level.
     *
     * @param level - The log level
     * @param now - The current timestamp
     * @returns Formatted prefix string
     *
     * @protected
     */
    protected messagePrefix(level: LogLevel, now: Date): string;
    /**
     * Regular expression to match magic tags for code highlighting.
     *
     * @remarks
     * Matches tags like `<hl language>code</hl>` or `<chalk style>text</chalk>`
     *
     * @protected
     */
    protected static readonly magicTagRegExp: RegExp;
    /**
     * Processes the log message, stripping magic tags in plain console output.
     *
     * @param level - The log level
     * @param msg - The message string
     * @returns Processed message string
     *
     * @protected
     */
    protected handleMessage(level: LogLevel, msg: string): string;
    /**
     * Formats metadata object as YAML with indentation.
     *
     * @param obj - The metadata object to format
     * @returns Formatted YAML string with proper indentation
     *
     * @protected
     */
    protected handleMetadata(obj: object): string;
    /**
     * Options for YAML serialization of metadata.
     *
     * @remarks
     * Includes custom replacer to handle Error objects, functions, and BigInt values.
     *
     * @protected
     */
    protected static readonly yamlDumpOptions: DumpOptions;
    /**
     * Output function for writing to stdout.
     *
     * @remarks
     * Can be replaced for testing or custom output handling.
     *
     * @public
     */
    static stdout: (arg: string) => void;
}
