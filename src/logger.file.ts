import {TextBasedLogger} from './logger.text';
import * as fs from 'fs';
import * as process from 'process';

/**
 * File-based logger implementation that outputs to a file.
 * 
 * @remarks
 * This logger formats messages with timestamps and log levels in plain text
 * and writes them to a file. It uses a static write function to handle all
 * file operations, similar to how ConsoleLogger uses a static stdout function.
 * 
 * The file path is determined by the LOG4JS_FILE environment variable,
 * defaulting to 'latest.log' if not specified.
 * 
 * Message format: `[HH:MM:SS] [name/LEVEL] message`
 * 
 * @public
 */
export class FileLogger extends TextBasedLogger {
  private static currentFilePath: string | null = null;

  /**
   * Creates a new FileLogger instance.
   * 
   * @param name - The name/identifier for this logger instance
   */
  constructor(readonly name: string) {
    super(name);
    FileLogger.ensureFilePath();
  }

  /**
   * Ensures the file path is set from environment variables.
   * 
   * @private
   */
  private static ensureFilePath(): void {
    FileLogger.currentFilePath = process.env.LOG4JS_FILE || 'latest.log';
  }

  /**
   * Writes a formatted log message to the file.
   * 
   * @param message - The formatted message to write
   * 
   * @protected
   */
  protected writeOutput(message: string): void {
    FileLogger.ensureFilePath();
    if (FileLogger.currentFilePath !== null) {
      FileLogger.writeFile(FileLogger.currentFilePath, message + '\n');
    }
  }

  /**
   * Static function for writing to a file.
   * 
   * @param filePath - The path to the file to write to
   * @param content - The content to write
   * 
   * @remarks
   * Can be replaced for testing or custom output handling.
   * Defaults to fs.appendFileSync for immediate writes.
   * 
   * @public
   */
  public static writeFile: (filePath: string, content: string) => void = (filePath, content) => {
    fs.appendFileSync(filePath, content, 'utf8');
  };

  /**
   * Gets the current file path being used for logging.
   * 
   * @returns The current log file path
   * 
   * @public
   */
  public static getFilePath(): string | null {
    FileLogger.ensureFilePath();
    return FileLogger.currentFilePath;
  }
}
