# Calculator

A build of this project is avaliable @ [sheraff.github.io/calculator](https://sheraff.github.io/calculator/).

On each user input, a **Web Worker** parses the string into an **Abstract Syntax Tree** (AST) in order to resolve the operations. The parser is built following the **Open-Closed Principle** where functionality is added by **Dependency Injection**.

## Engines

- node: `16.13.2`
- npm: `8.1.2`

## Scripts

- `npm start` to run locally
- `npm test` for some Jest coverage of underlying math parser

## Folders

```
./src
  |
  |- /App: main component
  |
  |- /assets
  |      |- /hooks: general purpose React hooks
  |      |- /scripts: math parsing logic
  |      |- /styles: global sheet & sass variables
  |
  |- /components
         |- /Caret: replicate native caret on a single line of text
         |- /Dynamic: various uses of <Value> based on AST data
         |- /History: store previous results
         |- /Input: the <input> on which this app is based
         |- /NumPad: keyboard UI, dispatches user input
         |- /Output: orchestration of <Input>, <Parsed>, <Result>
         |- /Parsed: "mirror image" of <Input> but with AST data
         |- /Result: live result of current <input> string
         |- /Value: display AST node, handles text selection & hover priority
```

## Easter egg
Use numpad to input `123456789` to enable / disable the "free input" mode. This allows you to test the limits of the `MathParser` class. 

When using a mouse, you can hover the second line of text to observe how values are parsed and which operation takes priority. Or alternatively, you can use the <kbd>←</kbd> and <kbd>→</kbd> keys to move the caret in the *input* (`<Input>` component) and see it mapped to the *output* (`<Parsed>` component).

When the text overflows its allocated space, both the *input* and the *output* should have their scrolls synced.

## Math Parser

- MathParser/index.js: based on a list of plugins, processes an incoming string to produce an AST (Abstract Syntax Tree). The procedure only has a few steps, but all plugins must implement these steps:
  1. `tokenize` converts an array of chars into an array of `Token` objects
  2. `reduce` converts an array of `Token` into a `Node` tree
  3. `resolve` walks the `Node` tree and computes the numerical value of each `Node`
  4. `stringify` walks the `Node` tree and computes display string of each `Node`
  5. `mapRange` walks the `Node` and maps the indexes of the input string to indexes in the output string

- MathParser/plugins: each plugin extends `MathParser/classes/Plugin.js` which implements one function for each of the 5 steps of `MathParser`. A plugin may also override its own `Token` or `Node` type.

## Nice to have

- History of operations: appears after having at least 1 result
- Use of keyboard: can be unlocked by using the interface to enter `123456789`
- Dark mode: will respond to browser preferences based on `prefers-color-scheme` query
- Complex math: each MathParser plugin implements a little bit of math. You can try the following strings: `+, -, *, /, ×, ÷, ^, π, pi, e, gold, phi, ɸ, tau, τ, infinity, ∞, !, ², ³, %, sin, cos, tan, log, ln, sqrt, √, abs, floor, ceil, round, sin⁻¹, cos⁻¹, tan⁻¹, asin, acos, atan`
- Responsive layout: most phone sizes should work, horizontal or vertical
- Tests: not a full coverage, but the math parsing logic is backed by Jest, try `npm test`

## Limits

- I did not take the time to eject from Create-React-App and configure the project
- Factorials of float numbers are not implemented correctly (for example `3.1!`)
- Very big numbers are not supported
- In a real project, I might have used an external package for "float math"