import { ConsoleLogger } from './logger.console';
import { LogLevel } from './logger.level';
/**
 * Colorful console logger with syntax highlighting support.
 *
 * @remarks
 * Extends ConsoleLogger to add color support using chalk and syntax highlighting
 * using cli-highlight. This logger automatically detects and highlights code snippets
 * in different languages using magic tags like `<hl sql>SELECT * FROM table</hl>`.
 *
 * Features:
 * - Colored timestamps and log levels
 * - Syntax highlighting for YAML metadata
 * - Support for embedded code snippets with language-specific highlighting
 * - Chalk formatting via `<chalk style>text</chalk>` tags
 *
 * @public
 */
export declare class ColorfulConsoleLogger extends ConsoleLogger {
    /**
     * Formats the message prefix with colored timestamps and log levels.
     *
     * @param level - The log level
     * @param now - The current timestamp
     * @returns Formatted and colored prefix string
     *
     * @protected
     */
    protected messagePrefix(level: LogLevel, now: Date): string;
    /**
     * Magic tag processors for special formatting.
     *
     * @remarks
     * - `hl`: Syntax highlights code in the specified language
     * - `chalk`: Applies chalk styling to text
     *
     * @private
     */
    private static readonly magics;
    /**
     * Regular expression to match placeholder tags for deferred highlighting.
     *
     * @private
     */
    private static readonly toBeReplacedRegExp;
    /**
     * Processes and colorizes log messages with syntax highlighting.
     *
     * @param level - The log level (used for colorization)
     * @param msg - The message string to process
     * @returns Highlighted and colored message
     *
     * @protected
     */
    protected handleMessage(level: LogLevel, msg: string): string;
    /**
     * Formats and highlights metadata object as YAML with embedded code snippets.
     *
     * @param obj - The metadata object to format
     * @returns Syntax-highlighted YAML string with embedded code
     *
     * @remarks
     * This function:
     * 1. Converts the object to YAML
     * 2. Extracts magic tags for code snippets
     * 3. Highlights the YAML structure
     * 4. Re-inserts highlighted code snippets
     *
     * @example
     * ```typescript
     * // Input object with magic tag:
     * { query: '<hl sql>SELECT * FROM users</hl>' }
     * // Output: Highlighted YAML with SQL code properly highlighted
     * ```
     *
     * @protected
     */
    protected handleMetadata(obj: object): string;
    /**
     * Processes a string to apply syntax highlighting and magic tag transformations.
     *
     * @param str - The string to highlight
     * @returns The fully highlighted string
     *
     * @remarks
     * This is a two-pass process:
     * 1. Extract and process magic tags, replace with placeholders
     * 2. Highlight the main content as YAML
     * 3. Re-insert the processed magic tag content
     *
     * @private
     */
    private handleHighlight;
    /**
     * Theme configuration for syntax highlighting.
     *
     * @remarks
     * Defines colors for different syntax elements using chalk.
     *
     * @private
     */
    private static readonly theme;
    /**
     * Color mapping for different log levels.
     *
     * @remarks
     * Each log level gets a distinct color for easy visual identification:
     * - debug: cyan
     * - info: blue
     * - warn: yellow
     * - error: red
     *
     * @private
     */
    private static readonly levelColor;
}
