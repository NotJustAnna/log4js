import { TextBasedLogger } from './logger.text';

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
export class ConsoleLogger extends TextBasedLogger {
  /**
   * Creates a new ConsoleLogger instance.
   * 
   * @param name - The name/identifier for this logger instance
   */
  constructor(readonly name: string) {
    super(name);
  }

  /**
   * Writes a formatted log message to stdout.
   * 
   * @param message - The formatted message to write
   * 
   * @protected
   */
  protected writeOutput(message: string): void {
    ConsoleLogger.stdout(message);
  }

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
