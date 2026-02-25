import banChalk from '../../src/rules/ban-chalk.ts';
import { ruleTester } from '../support.ts';

ruleTester.run('ban-chalk', banChalk, {
  valid: [
    {
      filename: 'file.ts',
      code: `import { styleText } from 'node:util';`,
    },
    {
      filename: 'file.ts',
      code: `import { styleText } from 'node:util'; styleText('red', 'error')`,
    },
  ],
  invalid: [
    // Import fixes
    {
      filename: 'file.ts',
      code: `import chalk from 'chalk';`,
      output: `import { styleText } from 'node:util';`,
      errors: [{ messageId: 'invalidImport' }],
    },
    {
      filename: 'file.ts',
      code: `import chalk from "chalk";`,
      output: `import { styleText } from "node:util";`,
      errors: [{ messageId: 'invalidImport' }],
    },
    {
      // Named imports can't be auto-fixed
      filename: 'file.ts',
      code: `import { red } from 'chalk';`,
      output: null,
      errors: [{ messageId: 'invalidImport' }],
    },
    // Usage fixes
    {
      filename: 'file.ts',
      code: `import chalk from 'chalk'; chalk.red('error')`,
      output: `import { styleText } from 'node:util'; styleText('red', 'error')`,
      errors: [{ messageId: 'invalidImport' }, { messageId: 'invalidUsage' }],
    },
    {
      filename: 'file.ts',
      code: `import chalk from 'chalk'; chalk.bold.red('error')`,
      output: `import { styleText } from 'node:util'; styleText(['bold', 'red'], 'error')`,
      errors: [{ messageId: 'invalidImport' }, { messageId: 'invalidUsage' }],
    },
    {
      filename: 'file.ts',
      code: `import chalk from 'chalk'; chalk.red.bold.underline('text')`,
      output: `import { styleText } from 'node:util'; styleText(['red', 'bold', 'underline'], 'text')`,
      errors: [{ messageId: 'invalidImport' }, { messageId: 'invalidUsage' }],
    },
    {
      // Template literal argument
      filename: 'file.ts',
      code: `import chalk from 'chalk'; chalk.red(\`error: \${message}\`)`,
      output: `import { styleText } from 'node:util'; styleText('red', \`error: \${message}\`)`,
      errors: [{ messageId: 'invalidImport' }, { messageId: 'invalidUsage' }],
    },
    {
      // Multiple arguments — no usage fix
      filename: 'file.ts',
      code: `import chalk from 'chalk'; chalk.red('a', 'b')`,
      output: `import { styleText } from 'node:util'; chalk.red('a', 'b')`,
      errors: [{ messageId: 'invalidImport' }, { messageId: 'invalidUsage' }],
    },
    {
      // chalk() called directly — no usage fix
      filename: 'file.ts',
      code: `import chalk from 'chalk'; chalk('text')`,
      output: `import { styleText } from 'node:util'; chalk('text')`,
      errors: [{ messageId: 'invalidImport' }, { messageId: 'invalidUsage' }],
    },
    {
      // Renamed default import
      filename: 'file.ts',
      code: `import c from 'chalk'; c.green('ok')`,
      output: `import { styleText } from 'node:util'; styleText('green', 'ok')`,
      errors: [{ messageId: 'invalidImport' }, { messageId: 'invalidUsage' }],
    },
  ],
});
