import chalk, { Chalk } from 'chalk';
import { dump } from 'js-yaml';
import { highlight, Theme } from 'cli-highlight';
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
export class ColorfulConsoleLogger extends ConsoleLogger {
  /**
   * Formats the message prefix with colored timestamps and log levels.
   * 
   * @param level - The log level
   * @param now - The current timestamp
   * @returns Formatted and colored prefix string
   * 
   * @protected
   */
  protected messagePrefix(level: LogLevel, now: Date): string {
    return (
      '[' +
      chalk.blueBright(now.getHours().toString().padStart(2, '0')) +
      ':' +
      chalk.blueBright(now.getMinutes().toString().padStart(2, '0')) +
      ':' +
      chalk.blueBright(now.getSeconds().toString().padStart(2, '0')) +
      '] [' +
      chalk.magenta(this.name) +
      '/' +
      ColorfulConsoleLogger.levelColor[level](level.toUpperCase()) +
      ']'
    );
  }

  /**
   * Magic tag processors for special formatting.
   * 
   * @remarks
   * - `hl`: Syntax highlights code in the specified language
   * - `chalk`: Applies chalk styling to text
   * 
   * @private
   */
  private static readonly magics: Record<string, (param: string, value: string) => string> = {
    hl: (language, code) => highlight(code, { language, theme: ColorfulConsoleLogger.theme }),
    chalk: (param, value) => {
      const f = param.split('-').reduce<Chalk>((c: any, str) => {
        if (str in c) {
          return c[str] as Chalk;
        }
        console.info(`Unknown chalk function: ${str}`);
        return c;
      }, chalk);
      return f(value);
    },
  };

  /**
   * Regular expression to match placeholder tags for deferred highlighting.
   * 
   * @private
   */
  private static readonly toBeReplacedRegExp = /<TO-BE-REPLACED-(\d+)>/g;

  /**
   * Processes and colorizes log messages with syntax highlighting.
   * 
   * @param level - The log level (used for colorization)
   * @param msg - The message string to process
   * @returns Highlighted and colored message
   * 
   * @protected
   */
  protected handleMessage(level: LogLevel, msg: string): string {
    const highlighted = this.handleHighlight(msg);
    return ColorfulConsoleLogger.levelColor[level](highlighted);
  }

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
  protected handleMetadata(obj: object): string {
    // This function takes a JSON-compatible object, transforms it to YAML,
    // and syntax-highlights it. Additionally, magic Regex code was added in
    // to support highlighting snippets of code in other languages.
    // To see it in action: send `<hl sql>SELECT hello FROM world</hl>`
    // as a string anywhere inside the metadata object.

    // This first step dumps the metadata object as an YAML
    const dumped = dump(obj, ConsoleLogger.yamlDumpOptions)
      .split('\n')
      .map((v) => `  ${v}`)
      .join('\n')
      .trimEnd();

    return this.handleHighlight(dumped);
  }

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
  private handleHighlight(str: string) {
    // This next step rewrites the partially highlighted string using regex,
    // and stores further pieces of code inside an array. Then, the rewritten
    // string is highlighted as YAML using cli-highlight.
    const toBeHighlighted: string[] = [];
    const partiallyHighlighted = highlight(
      str.replace(ConsoleLogger.magicTagRegExp, (_, type, param, value) => {
        const s = `<TO-BE-REPLACED-${toBeHighlighted.length}>`;
        toBeHighlighted.push(ColorfulConsoleLogger.magics[type](param, value));
        return s;
      }),
      { language: 'yml', theme: ColorfulConsoleLogger.theme },
    );

    // No need to re-highlight a code if no highlight annotations were found.
    if (!toBeHighlighted.length) {
      return partiallyHighlighted;
    }

    // Lastly, the string is rewritten again using Regex in order to add back
    // the previously removed (and stored) strings, each being highlighted
    // using their defined language.
    return partiallyHighlighted.replace(ColorfulConsoleLogger.toBeReplacedRegExp, (_, index) => {
      return toBeHighlighted[Number(index)];
    });
  }

  /**
   * Theme configuration for syntax highlighting.
   * 
   * @remarks
   * Defines colors for different syntax elements using chalk.
   * 
   * @private
   */
  private static readonly theme: Theme = {
    keyword: chalk.blueBright,
    type: chalk.magentaBright,
    built_in: chalk.magentaBright,
    comment: chalk.gray,
    string: chalk.green,
    regexp: chalk.blueBright,
    literal: chalk.yellowBright,
  };

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
  private static readonly levelColor: Record<LogLevel, Chalk> = {
    debug: chalk.cyan,
    info: chalk.blue,
    warn: chalk.yellow,
    error: chalk.red,
  };
}
