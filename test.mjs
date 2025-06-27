import fs from 'node:fs';
import path from 'node:path';

import { RuleTester } from 'eslint';
import sinon from 'sinon';

import cssModuleNameMatchesRule from './src/rules/css-module-name-matches.mjs';
import cssModuleClassExists from './src/rules/css-module-class-exists.mjs';

const fakeFileSystem = {
  [`Button.module.css`]: `
    .container {
      background-color: blue;
    }

    .container.disabled {
      color: gray;
    }

    .container:not(.active) {
      opacity: 0.5;
    }

    @media (max-width: 600px) {
      .responsive {
        width: 100%;
      }
    }

    @container (width > 0) {
      .containerQuery {
        background-color: pink;
      }
    }
  `,
};

sinon.stub(fs, 'existsSync').callsFake((filePath) => {
  const relativeFilePath = filePath
    .replace(process.cwd(), '')
    .replace(/^\//, '');

  return fakeFileSystem[relativeFilePath] != null;
});

sinon.stub(fs, 'readFileSync').callsFake((filePath) => {
  const relativeFilePath = filePath
    .replace(process.cwd(), '')
    .replace(/^\//, '');

  return fakeFileSystem[relativeFilePath];
});

const ruleTester = new RuleTester({
  // Must use at least ecmaVersion 2015 because
  // that's when `const` variables were introduced.
  languageOptions: { ecmaVersion: 2015 },
});

// Throws error if the tests in ruleTester.run() do not pass
ruleTester.run(
  'css-module-name-matches', // rule name
  cssModuleNameMatchesRule, // rule code
  {
    // checks
    // 'valid' checks cases that should pass
    valid: [
      {
        filename: 'Button.tsx',
        code: "import styles from './Button.module.css';",
      },
    ],
    // 'invalid' checks cases that should not pass
    invalid: [
      {
        filename: 'Button.tsx',
        code: "import styles from './NotButton.module.css';",
        errors: 1,
      },
    ],
  },
);

ruleTester.run(
  'css-module-class-name-exists', // rule name
  cssModuleClassExists, // rule code
  {
    // checks
    // 'valid' checks cases that should pass
    valid: [
      {
        filename: 'Button.tsx',
        code: `import styles from './Button.module.css';`,
      },
      // {
      //   filename: "Button.tsx",
      //   code: `import styles from '../relative/path/to/Button.module.css';`,
      // },
      {
        filename: 'Button.tsx',
        code: `
          import styles from './Button.module.css';

          const buttonClass = styles.container;
        `,
      },
      {
        filename: 'Button.tsx',
        code: `
          import styles from './Button.module.css';

          const buttonClass = styles['container'];
        `,
      },
      {
        filename: 'Button.tsx',
        code: `
          import styles from './Button.module.css';

          const { container } = styles;
        `,
      },
      {
        filename: 'Button.tsx',
        code: `
          import styles from './Button.module.css';

          const disabledClass = styles.disabled;
        `,
      },
      {
        filename: 'Button.tsx',
        code: `
          import styles from './Button.module.css';

          const activeClass = styles.active;
        `,
      },
      {
        filename: 'Button.tsx',
        code: `
          import styles from './Button.module.css';

          const responsiveClass = styles.responsive;
        `,
      },
      {
        filename: 'Button.tsx',
        code: `
          import styles from './Button.module.css';

          const containerClass = styles.containerQuery;
        `,
      },
    ],
    // 'invalid' checks cases that should not pass
    invalid: [
      {
        filename: 'Button.tsx',
        code: `import styles from '/absolute/path/to/Button.module.css';`,
        errors: 1,
      },
      {
        filename: 'Button.tsx',
        code: `import { container } from './Button.module.css';`,
        errors: 1,
      },
      {
        filename: 'Button.tsx',
        code: `
          import styles from './Button.module.css';

          const buttonClass = styles.nonExistentClass;
        `,
        errors: 1,
      },
      {
        filename: 'Button.tsx',
        code: `
          import styles from './Button.module.css';

          const buttonClass = styles['nonExistentClass'];
        `,
        errors: 1,
      },
      {
        filename: 'Button.tsx',
        code: `
          import styles from './Button.module.css';

          const { nonExistentClass } = styles;
        `,
        errors: 1,
      },
    ],
  },
);

console.log('All tests passed!');
