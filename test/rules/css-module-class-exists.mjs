import cssModuleClassExists from '../../src/rules/css-module-class-exists.mjs';
import { ruleTester, stubFileSystem, normalizeTest } from '../support.mjs';

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
    normalizeTest({
      filename: 'Button.tsx',
      code: `import styles from './Button.module.css';`,
    }),
    normalizeTest({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const buttonClass = styles.container;
      `,
    }),
    normalizeTest({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const buttonClass = styles['container'];
      `,
    }),
    normalizeTest({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const { container } = styles;
      `,
    }),
    normalizeTest({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const disabledClass = styles.disabled;
      `,
    }),
    normalizeTest({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const activeClass = styles.active;
      `,
    }),
    normalizeTest({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const responsiveClass = styles.responsive;
      `,
    }),
    normalizeTest({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const containerClass = styles.containerQuery;
      `,
    }),
    normalizeTest({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const layerClass = styles.layer;
      `,
    }),
  ],
  invalid: [
    normalizeTest({
      filename: 'Button.tsx',
      code: `import styles from '/absolute/path/to/Button.module.css';`,
      errors: 1,
    }),
    normalizeTest({
      filename: 'Button.tsx',
      code: `import { container } from './Button.module.css';`,
      errors: 1,
    }),
    normalizeTest({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const buttonClass = styles.nonExistentClass;
      `,
      errors: 1,
    }),
    normalizeTest({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const buttonClass = styles['nonExistentClass'];
      `,
      errors: 1,
    }),
    normalizeTest({
      filename: 'Button.tsx',
      code: `
        import styles from './Button.module.css';
        const { nonExistentClass } = styles;
      `,
      errors: 1,
    }),
  ],
});
