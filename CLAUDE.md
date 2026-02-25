# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn test              # Run all tests
yarn build             # Build dist (ESM + CJS + types via rollup + tsc)
yarn lint              # Run ESLint
yarn types:check       # TypeScript type check without emitting
```

To run a single test file:
```bash
node --experimental-strip-types test/rules/<rule-name>.ts
```

## Architecture

This is an ESLint plugin (`@friendsoftheweb/eslint-plugin`) that exports a set of custom lint rules.

**Entry point:** `src/index.ts` — registers all rules, defines the `flat/recommended`, `flat/future`, and `flat/migrate` configs, and exports the plugin object.

**Rules** live in `src/rules/<rule-name>.ts`. Each rule is typed as `RuleModule` from `@typescript-eslint/utils/ts-eslint` and exported as a default export.

**Tests** live in `test/rules/<rule-name>.ts` and use `@typescript-eslint/rule-tester`. The test runner is Node's built-in `node:test` module wired to `RuleTester` in `test/support.ts`. `test/index.ts` imports all rule test files.

**Test utilities** (`test/support.ts`):
- `ruleTester` — shared `RuleTester` instance
- `stubFileSystem(fakeFileSystem)` — stubs `fs.existsSync` and `fs.readFileSync` using sinon for rules that read files from disk (e.g. `css-module-class-exists`, `css-module-name-matches`)
- `normalizeTestCase` — trims indentation from multiline test code strings

**Build:** Rollup bundles `src/index.ts` into both `dist/esm` (ES module) and `dist/cjs` (CommonJS). TypeScript declarations are emitted separately via `tsconfig.build.json` into `dist/types`.

**Config tiers:**
- `flat/recommended` — all rules as errors, except `react-named-func-components` (off)
- `flat/future` — all rules as errors, `react-named-func-components` as warn
- `flat/migrate` — all rules as warnings, `react-named-func-components` off

## Adding a New Rule

1. Create `src/rules/<rule-name>.ts` — export a `RuleModule` as default
2. Import and register it in `src/index.ts` under `plugin.rules`
3. Create `test/rules/<rule-name>.ts` using `ruleTester.run()`
4. Import the test file in `test/index.ts`
5. Add it to the appropriate config tier(s) in `src/index.ts`
