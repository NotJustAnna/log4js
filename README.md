# **@notjustanna/log4js**

A lightweight, environment-aware logging library for Node.js with Log4j-style ergonomics, rich console output, and zero configuration.

Built with a minimal dependency surface (`chalk`, `cli-highlight`, `js-yaml`, `lambda-log`) and released under the **MIT license**. Fully typed and documented via JSDoc—no extra `@types` needed.

---

## **Features**

* **Environment-aware** — auto-detects Lambda, colorful TTY, or plain mode
* **File logging support** — log to files with `LOG4JS_FILE` or `LOG4JS_MODE=file`
* **Multi-destination logging** — simultaneously log to console and file
* **Structured logging** with predictable JSON/YAML-style metadata
* **Magic `<hl>` and `<chalk>` tags** for inline syntax highlighting & styling
* **Tiny footprint** — simple codebase, no heavy framework
* **Log4j-inspired, TypeScript-first** API

---

## **Why Log4JS?**

* You want **familiar Log4j semantics** without Java-level ceremony
* You prefer **simple, predictable logs** in all environments (CLI, CI, Lambda)
* You don’t want a 10,000-LoC framework when **<500 lines** does the job
* You want pretty logs locally, structured logs in AWS, and zero configuration
* You like **modern niceties** (highlighting, stable serialization, TS types)

---

## **Installation**

```bash
npm install @notjustanna/log4js
```

---

## **Quick Usage**

```ts
import { log4js } from '@notjustanna/log4js';

const logger = log4js("MyApp");

logger.info("Application started");
logger.warn("Cache nearly full", { usage: 95 });
logger.error("DB connection failed", { host: "db.local" });
logger.debug("Init config", { config });
```

---

## **Magic Tags (Highlighting & Chalk)**

```ts
logger.info("Query executed", {
  sql: "<hl sql>SELECT * FROM users WHERE id = ?</hl>",
  status: "<chalk green>OK</chalk>"
});
```

**Mode behavior:**

| Environment          | Result                                                       |
| -------------------- | ------------------------------------------------------------ |
| **Colorful console** | Tags rendered → syntax highlight & chalk styling             |
| **Plain console**    | Tags stripped → clean text                                   |
| **AWS Lambda**       | Tags preserved in JSON (CloudWatch won’t render them anyway) |

---

## **Environment Detection**

`log4js()` chooses the appropriate logger mode via:

1. `LOG4JS_MODE` (forced override)
2. `LOG4JS_FILE` (enables file logging)
3. AWS Lambda detection
4. TTY + color support
5. Fallback to plain mode

**Manual override:**

```bash
LOG4JS_MODE=lambda   node app.js
LOG4JS_MODE=colorful node app.js
LOG4JS_MODE=plain    node app.js
LOG4JS_MODE=file     node app.js  # logs to latest.log
```

**File logging:**

```bash
# Log to a specific file (also outputs to console)
LOG4JS_FILE=app.log node app.js

# Use default file name (latest.log) and auto-detect console mode
LOG4JS_MODE=file node app.js

# Combine colorful console with file logging
LOG4JS_MODE=colorful,file LOG4JS_FILE=app.log node app.js

# Plain console + file logging
LOG4JS_MODE=plain,file LOG4JS_FILE=debug.log node app.js
```

**How it works:**
- When `LOG4JS_FILE` is set, a `FileLogger` is created alongside the console logger
- When `LOG4JS_MODE` includes `file`, file logging is enabled (uses `latest.log` if `LOG4JS_FILE` not set)
- Multiple logger instances share a single file handle to avoid opening multiple handles to the same file
- File output is always plain text (no ANSI colors), even when console uses colorful mode

---

## **Log Level Filtering**

Control which log messages are displayed using the `LOG4JS_LEVEL` environment variable. Only messages at or above the specified level will be logged.

**Log levels (from least to most verbose):**
- `error` - Only errors
- `warn` - Warnings and errors
- `info` - Info, warnings, and errors (default)
- `debug` - All messages

**Example:**

```bash
# Only show warnings and errors
LOG4JS_LEVEL=warn node app.js

# Show all messages including debug
LOG4JS_LEVEL=debug node app.js

# Default: info level (if not specified)
node app.js
```

**In code:**

```ts
const logger = log4js("MyApp");

// With LOG4JS_LEVEL=warn
logger.debug("Debug info");  // Not logged
logger.info("Starting...");  // Not logged
logger.warn("Low disk");     // Logged
logger.error("Failed!");     // Logged
```

---

## **API Surface**

The library intentionally exposes only the essentials:

### **Logger Methods**

```ts
logger.info(msg, meta?)
logger.warn(msg, meta?)
logger.error(msg, meta?)
logger.debug(msg, meta?)
logger.log(level, msg, meta?) // low-level escape hatch
```

All functions/classes/BigInts/Errors in metadata are serialized safely.

### **Factory Functions**

```ts
import { 
  log4js,                     // Auto-detect environment
  createConsoleLogger,        // Plain text console
  createColorfulConsoleLogger, // Colorful console with highlighting
  createLambdaLogger,         // AWS Lambda JSON format
  createFileLogger            // File logging
} from '@notjustanna/log4js';

// Auto-detected logger
const logger = log4js('MyApp');

// Specific logger types
const plainLogger = createConsoleLogger('Plain');
const colorLogger = createColorfulConsoleLogger('Color');
const lambdaLogger = createLambdaLogger('Lambda');
const fileLogger = createFileLogger('File'); // Uses LOG4JS_FILE or latest.log
```

---

## **Architecture**

The library is built with a layered architecture:

### **Logger Hierarchy**

```
Logger (abstract base)
├── TextBasedLogger (abstract, shared text formatting)
│   ├── ConsoleLogger (plain text to stdout)
│   │   └── ColorfulConsoleLogger (with syntax highlighting)
│   └── FileLogger (plain text to file)
├── LambdaLogger (JSON format for CloudWatch)
└── DelegateLogger (forwards to multiple loggers)
```

### **Key Components**

- **Logger** - Abstract base class with level filtering and convenience methods
- **TextBasedLogger** - Extracted common text formatting logic from ConsoleLogger
- **ConsoleLogger** - Uses static `stdout` function (injectable for testing)
- **FileLogger** - Uses static `writeFile` function, shares file handle logic
- **DelegateLogger** - Forwards log calls to an array of loggers (enables multi-destination)
- **ColorfulConsoleLogger** - Extends ConsoleLogger with color and highlighting

### **Static Output Handling**

Both `ConsoleLogger` and `FileLogger` use static output functions to avoid multiple handles:

```ts
// ConsoleLogger uses a static stdout
ConsoleLogger.stdout = (msg) => console.log(msg);

// FileLogger uses a static writeFile
FileLogger.writeFile = (path, content) => fs.appendFileSync(path, content);
```

This design ensures:
- Multiple logger instances can share the same output destination
- Easy mocking/testing by replacing the static function
- No file handle leaks or conflicts

---

## **Examples**

### Express Middleware

```ts
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    logger.info("Request completed", {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: Date.now() - start
    });
  });

  next();
});
```

### AWS Lambda

```ts
const logger = log4js("MyLambda");

export const handler = async (event, context) => {
  logger.info("Invocation", { requestId: context.awsRequestId });

  try {
    const result = await processEvent(event);
    logger.info("Success", { result });
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (err) {
    logger.error("Failure", { error: err });
    return { statusCode: 500, body: "Internal error" };
  }
};
```

### File Logging

```ts
// Enable file logging via environment variable
// LOG4JS_FILE=app.log node app.js

const logger = log4js("MyApp");
logger.info("This goes to both console and app.log");

// Or create a file logger directly
import { createFileLogger } from '@notjustanna/log4js';

const fileLogger = createFileLogger("FileApp");
fileLogger.info("This goes to latest.log (or LOG4JS_FILE if set)");
```

### Multi-Destination Logging

```ts
// LOG4JS_MODE=colorful,file LOG4JS_FILE=production.log node app.js

const logger = log4js("WebServer");

app.use((req, res, next) => {
  logger.info("Request", {
    method: req.method,
    path: req.path,
    ip: req.ip
  });
  // Logs to both:
  // - Console (with colors)
  // - production.log (plain text)
  next();
});
```
