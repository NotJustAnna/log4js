"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
/**
 * Abstract base class for all logger implementations.
 *
 * @remarks
 * This class provides a common interface for different logging backends.
 * Concrete implementations must provide the `log` method, while this class
 * provides convenience methods for each log level (info, warn, error, debug).
 *
 * @public
 */
class Logger {
    /**
     * Creates a new Logger instance.
     *
     * @param name - The name/identifier for this logger instance
     */
    constructor(name) {
        this.name = name;
    }
    /**
     * Logs an informational message with optional metadata.
     *
     * @param msg - The message to log
     * @param meta - Optional metadata to include
     */
    info(msg, meta) {
        this.log('info', msg, meta);
    }
    /**
     * Logs a warning message with optional metadata.
     *
     * @param msg - The message to log
     * @param meta - Optional metadata to include
     */
    warn(msg, meta) {
        this.log('warn', msg, meta);
    }
    /**
     * Logs an error message with optional metadata.
     *
     * @param msg - The message to log
     * @param meta - Optional metadata to include
     */
    error(msg, meta) {
        this.log('error', msg, meta);
    }
    /**
     * Logs a debug message with optional metadata.
     *
     * @param msg - The message to log
     * @param meta - Optional metadata to include
     */
    debug(msg, meta) {
        this.log('debug', msg, meta);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map