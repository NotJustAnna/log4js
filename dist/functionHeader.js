"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functionHeader = functionHeader;
/** Regular expression to match standard function declarations */
const MATCH_FUNCTION_HEADER = /^(?:async\s*)?function\s*(?:\w+\s*)?\([^)]*\)(?:\s*\{\s*})?/;
/** Regular expression to match arrow function expressions */
const MATCH_ARROW_FUNCTION_HEADER = /^\s*\(?[^)]*\)?\s*=>(?:\s*\{(?:\s*})?)?/;
/** Regular expression to match class method declarations */
const MATCH_METHOD_HEADER = /^(?:async|static\s*)*\w+\s*\w+\s*\([^)]*\)(?:\s*\{\s*})?/;
/** Regular expression to match class declarations */
const MATCH_CLASS_HEADER = /^class\s+\w+(?:\s*\{\s*})?/;
/** Regular expression to match constructor declarations */
const MATCH_CONSTRUCTOR_HEADER = /constructor\s*\([^)]*\)(?:\s*\{\s*})?/;
/**
 * Prettifies a function source string by normalizing whitespace and formatting.
 *
 * @param source - The source code string to prettify
 * @returns The prettified source code with normalized whitespace
 *
 * @remarks
 * This function:
 * - Collapses multiple spaces into single spaces
 * - Normalizes empty blocks `{ }` to `{}`
 * - Normalizes empty parameter lists `( )` to `()`
 * - Ensures consistent spacing around braces and parentheses
 * - Normalizes comma spacing
 *
 * @internal
 */
function prettify(source) {
    return source
        .replace(/\s+/g, ' ')
        .replace(/\{\s+}/g, '{}')
        .replace(/\(\s+\)/g, '()')
        .replace(/\s+\{/g, ' {')
        .replace(/\s+\(/g, ' (')
        .replace(/\s+\)/g, ')')
        .replace(/\s*,\s*/g, ', ')
        .trim();
}
/**
 * Extracts and formats the function header (signature) from a function.
 *
 * @param fn - The function to extract the header from
 * @returns A formatted string representing the function signature
 *
 * @remarks
 * This utility function extracts the function signature from various types of functions:
 * - Regular functions: `function name(params) { ... }`
 * - Async functions: `async function name(params) { ... }`
 * - Arrow functions: `(params) => { ... }`
 * - Class methods: `methodName(params) { ... }`
 * - Constructors: `constructor(params) { ... }`
 * - Classes: `class ClassName { constructor(params) { ... } }`
 *
 * The extracted signature is prettified with normalized whitespace and
 * ellipsis (`...`) to indicate omitted function body.
 *
 * @example
 * ```typescript
 * const myFunc = async function test(a, b) { return a + b; };
 * functionHeader(myFunc); // Returns: "async function test(a, b) { ... }"
 *
 * const arrow = (x) => x * 2;
 * functionHeader(arrow); // Returns: "(x) => ..."
 *
 * class MyClass {
 *   constructor(name) { this.name = name; }
 * }
 * functionHeader(MyClass); // Returns: "class MyClass { constructor(name) { ... } }"
 * ```
 *
 * @public
 */
function functionHeader(fn) {
    const source = Function.prototype.toString.call(fn);
    const matchFunction = source.match(MATCH_FUNCTION_HEADER) ?? source.match(MATCH_METHOD_HEADER);
    if (matchFunction) {
        const matched = matchFunction[0];
        return matched.includes('{') ? prettify(matched) : prettify(`${matched} { ... }`);
    }
    const matchArrowFunction = source.match(MATCH_ARROW_FUNCTION_HEADER);
    if (matchArrowFunction) {
        const matched = matchArrowFunction[0];
        return prettify(matched.includes('{') ? matched.includes('}') ? matched : `${matched} ... }` : `${matched} ...`);
    }
    const matchClass = source.match(MATCH_CLASS_HEADER);
    if (matchClass) {
        const matched = matchClass[0];
        const matchConstructor = source.match(MATCH_CONSTRUCTOR_HEADER);
        if (matchConstructor) {
            const subMatched = matchConstructor[0];
            return prettify(subMatched.includes('{') ? `${matched} { ${subMatched} }` : `${matched} { ${subMatched} { ... } }`);
        }
        return matched.includes('{') ? prettify(matched) : prettify(`${matched} { ... }`);
    }
    return prettify('function(...) { ... }');
}
//# sourceMappingURL=functionHeader.js.map