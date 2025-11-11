# **@notjustanna/log4js**

A lightweight, environment-aware logging library for Node.js with Log4j-style ergonomics, rich console output, and zero configuration.

Built with a minimal dependency surface (`chalk`, `cli-highlight`, `js-yaml`, `lambda-log`) and released under the **MIT license**. Fully typed and documented via JSDoc—no extra `@types` needed.

---

## **Features**

* **Environment-aware** — auto-detects Lambda, colorful TTY, or plain mode
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
2. AWS Lambda detection
3. TTY + color support
4. Fallback to plain mode

**Manual override:**

```bash
LOG4JS_MODE=lambda   node app.js
LOG4JS_MODE=colorful node app.js
LOG4JS_MODE=plain    node app.js
```

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

```ts
logger.info(msg, meta?)
logger.warn(msg, meta?)
logger.error(msg, meta?)
logger.debug(msg, meta?)
logger.log(level, msg, meta?) // low-level escape hatch
```

All functions/classes/BigInts/Errors in metadata are serialized safely.

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
