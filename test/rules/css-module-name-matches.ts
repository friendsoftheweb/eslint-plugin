import cssModuleNameMatchesRule from '../../src/rules/css-module-name-matches.ts';
import { ruleTester } from '../support.ts';

ruleTester.run('css-module-name-matches', cssModuleNameMatchesRule, {
  valid: [
    {
      filename: 'Button.tsx',
      code: "import styles from './Button.module.css';",
    },
  ],
  invalid: [
    {
      filename: 'Button.tsx',
      code: "import styles from './NotButton.module.css';",
      errors: [
        {
          messageId: 'filenameMismatch',
        },
      ],
    },
  ],
});
