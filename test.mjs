import fs from 'node:fs';

import { RuleTester } from 'eslint';
import sinon from 'sinon';

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

    @layer components {
      .layer {
        background-color: green;
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
  languageOptions: { ecmaVersion: 2018 },
});

import cssModuleNameMatchesRule from './src/rules/css-module-name-matches.mjs';

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
      errors: 1,
    },
  ],
});

import cssModuleClassExists from './src/rules/css-module-class-exists.mjs';

ruleTester.run('css-module-class-exists', cssModuleClassExists, {
  valid: [
    {
      filename: 'Button.tsx',
      code: `import styles from './Button.module.css';`,
    },
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
    {
      filename: 'Button.tsx',
      code: `
          import styles from './Button.module.css';

          const layerClass = styles.layer;
        `,
    },
  ],
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
});

import validServerActionsPathRule from './src/rules/valid-server-actions-path.mjs';

ruleTester.run('valid-server-actions-path', validServerActionsPathRule, {
  valid: [
    {
      filename: 'app/_actions.ts',
      code: "'use server';\n\nexport async function action() {}",
    },
    {
      filename: 'app/_actions/checkout.ts',
      code: "'use server';\n\nexport async function action() {}",
    },
    {
      filename: 'app/_actions/checkout/payment.ts',
      code: "'use server';\n\nexport async function action() {}",
    },
    {
      filename: 'app/checkout/_actions.ts',
      code: "'use server';\n\nexport async function action() {}",
    },
    {
      filename: 'app/actions.ts',
      code: 'export async function action() {}',
    },
  ],
  invalid: [
    {
      filename: 'app/checkout/actions.ts',
      code: "'use server';\n\nexport async function action() {}",
      errors: 1,
    },
    {
      filename: 'app/checkout/actions/checkout.ts',
      code: "'use server';\n\nexport async function action() {}",
      errors: 1,
    },
  ],
});

console.log('All tests passed!');
