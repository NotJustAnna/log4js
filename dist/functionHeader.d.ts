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
export declare function functionHeader(fn: Function): string;
