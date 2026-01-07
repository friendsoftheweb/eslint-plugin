import cssModuleClassExists from '../../src/rules/css-module-class-exists.ts';
import { ruleTester, stubFileSystem, normalizeTestCase } from '../support.ts';

stubFileSystem({
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
});

ruleTester.run('css-module-class-exists', cssModuleClassExists, {
  valid: [
    normalizeTestCase({
      filename: 'Button.tsx',
      code: `import styles from './Button.module.css';`,
    }),
    normalizeTestCase({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const buttonClass = styles.container;
      `,
    }),
    normalizeTestCase({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const buttonClass = styles['container'];
      `,
    }),
    normalizeTestCase({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const { container } = styles;
      `,
    }),
    normalizeTestCase({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const disabledClass = styles.disabled;
      `,
    }),
    normalizeTestCase({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const activeClass = styles.active;
      `,
    }),
    normalizeTestCase({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const responsiveClass = styles.responsive;
      `,
    }),
    normalizeTestCase({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const containerClass = styles.containerQuery;
      `,
    }),
    normalizeTestCase({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const layerClass = styles.layer;
      `,
    }),
  ],
  invalid: [
    normalizeTestCase({
      filename: 'Button.tsx',
      code: `import styles from '/absolute/path/to/Button.module.css';`,
      errors: [
        {
          messageId: 'relativePath',
        },
      ],
    }),
    normalizeTestCase({
      filename: 'Button.tsx',
      code: `import { container } from './Button.module.css';`,
      errors: [
        {
          messageId: 'onlyDefaultImport',
        },
      ],
    }),
    normalizeTestCase({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const buttonClass = styles.nonExistentClass;
      `,
      errors: [
        {
          messageId: 'classDoesNotExist',
        },
      ],
    }),
    normalizeTestCase({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const buttonClass = styles['nonExistentClass'];
      `,
      errors: [
        {
          messageId: 'classDoesNotExist',
        },
      ],
    }),
    normalizeTestCase({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const { nonExistentClass } = styles;
      `,
      errors: [
        {
          messageId: 'classDoesNotExist',
        },
      ],
    }),
  ],
});
