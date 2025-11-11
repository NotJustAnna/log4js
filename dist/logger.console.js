"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogger = void 0;
const logger_1 = require("./logger");
const js_yaml_1 = require("js-yaml");
const functionHeader_1 = require("./functionHeader");
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
class ConsoleLogger extends logger_1.Logger {
    /**
     * Creates a new ConsoleLogger instance.
     *
     * @param name - The name/identifier for this logger instance
     */
    constructor(name) {
        super(name);
        this.name = name;
    }
    /**
     * Logs a message with optional metadata to stdout.
     *
     * @param level - The severity level of the log message
     * @param msg - The message to log
     * @param meta - Optional metadata to include
     */
    log(level, msg, meta) {
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
    messagePrefix(level, now) {
        return ('[' +
            now.getHours().toString().padStart(2, '0') +
            ':' +
            now.getMinutes().toString().padStart(2, '0') +
            ':' +
            now.getSeconds().toString().padStart(2, '0') +
            '] [' +
            this.name +
            '/' +
            level.toUpperCase() +
            ']');
    }
    /**
     * Processes the log message, stripping magic tags in plain console output.
     *
     * @param level - The log level
     * @param msg - The message string
     * @returns Processed message string
     *
     * @protected
     */
    handleMessage(level, msg) {
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
    handleMetadata(obj) {
        return (0, js_yaml_1.dump)(obj, ConsoleLogger.yamlDumpOptions)
            .split('\n')
            .map((v) => `  ${v}`)
            .join('\n')
            .trimEnd()
            .replace(ConsoleLogger.magicTagRegExp, '$2');
    }
}
exports.ConsoleLogger = ConsoleLogger;
/**
 * Regular expression to match magic tags for code highlighting.
 *
 * @remarks
 * Matches tags like `<hl language>code</hl>` or `<chalk style>text</chalk>`
 *
 * @protected
 */
ConsoleLogger.magicTagRegExp = /<(hl|chalk) +([\w-]+) *>([\s\S]+?)<\/\1 *>/g;
/**
 * Options for YAML serialization of metadata.
 *
 * @remarks
 * Includes custom replacer to handle Error objects, functions, and BigInt values.
 *
 * @protected
 */
ConsoleLogger.yamlDumpOptions = {
    lineWidth: 120,
    quotingType: '"',
    skipInvalid: true,
    replacer: (_, value) => {
        if (!(value instanceof Error)) {
            if (typeof value === 'function') {
                return `<hl js>${(0, functionHeader_1.functionHeader)(value)}</hl>`;
            }
            else if (typeof value === 'bigint') {
                return value.toString();
            }
            else {
                return value;
            }
        }
        const error = {};
        Object.getOwnPropertyNames(value).forEach((key) => {
            error[key] = value[key];
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
ConsoleLogger.stdout = defaultStdout;
//# sourceMappingURL=logger.console.js.map