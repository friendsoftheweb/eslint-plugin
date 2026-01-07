import cssModuleClassExists from '../../src/rules/css-module-class-exists.mjs';
import { ruleTester, stubFileSystem } from '../support.mjs';

stubFileSystem(
  {
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
  },
  () => {
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
  },
);
