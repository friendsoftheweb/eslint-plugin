import reactNamedFuncComponents from '../../src/rules/react-named-func-components.ts';
import { normalizeTestCase, ruleTester } from '../support.ts';

ruleTester.run('react-named-func-components', reactNamedFuncComponents, {
  valid: [
    normalizeTestCase({
      filename: 'Component.tsx',
      code: `
        function Component() {
          return <div>Hello, world!</div>;
        }
      `,
    }),
    normalizeTestCase({
      filename: 'Component.tsx',
      code: `
        export function Component() {
          return <div>Hello, world!</div>;
        }
      `,
    }),
    normalizeTestCase({
      filename: 'Component.tsx',
      code: `
        export default function() {
          return <div>Hello, world!</div>;
        }
      `,
    }),
    normalizeTestCase({
      filename: 'Component.tsx',
      code: `
        export async function Component() {
          return <div>Hello, world!</div>;
        }
      `,
    }),
    normalizeTestCase({
      filename: 'Component.tsx',
      code: `
        const Component = forwardRef(() => {
          return <div>Hello, world!</div>;
        });
      `,
    }),
    normalizeTestCase({
      filename: 'Component.tsx',
      code: `
        export function Component() {
          return <>Hello, world!</>;
        }
      `,
    }),
  ],
  invalid: [
    normalizeTestCase({
      filename: 'Component.tsx',
      code: `
        const Component: FC = () => {
          return <div>Hello, world!</div>;
        }
      `,
      errors: [
        {
          messageId: 'invalidComponentDefinition',
        },
      ],
    }),
    normalizeTestCase({
      filename: 'Component.tsx',
      code: `
        const Component = () => {
          return <div>Hello, world!</div>;
        }
      `,
      errors: [
        {
          messageId: 'invalidComponentDefinition',
        },
      ],
    }),
    normalizeTestCase({
      filename: 'Component.tsx',
      code: `
        const Component: FC = async () => {
          return <div>Hello, world!</div>;
        }
      `,
      errors: [
        {
          messageId: 'invalidComponentDefinition',
        },
      ],
    }),
    normalizeTestCase({
      filename: 'Component.tsx',
      code: `
        const Component: FC = () => {
          return <>Hello, world!</>;
        }
      `,
      errors: [
        {
          messageId: 'invalidComponentDefinition',
        },
      ],
    }),
    normalizeTestCase({
      filename: 'Component.tsx',
      code: `
        const Component = async () => {
          return <div>Hello, world!</div>;
        }
      `,
      errors: [
        {
          messageId: 'invalidComponentDefinition',
        },
      ],
    }),
    normalizeTestCase({
      filename: 'Component.tsx',
      code: `
        const Component: FC = () => {
          return null;
        }
      `,
      errors: [
        {
          messageId: 'invalidComponentDefinition',
        },
      ],
    }),
    normalizeTestCase({
      filename: 'Component.tsx',
      code: `
        export const Component: FC = () => {
          return <div>Hello, world!</div>;
        }
      `,
      errors: [
        {
          messageId: 'invalidComponentDefinition',
        },
      ],
    }),
    normalizeTestCase({
      filename: 'Component.tsx',
      code: `
        export const Component = () => {
          return <div>Hello, world!</div>;
        }
      `,
      errors: [
        {
          messageId: 'invalidComponentDefinition',
        },
      ],
    }),
    normalizeTestCase({
      filename: 'Component.tsx',
      code: `
        export const Component: FC = async () => {
          return <div>Hello, world!</div>;
        }
      `,
      errors: [
        {
          messageId: 'invalidComponentDefinition',
        },
      ],
    }),
    normalizeTestCase({
      filename: 'Component.tsx',
      code: `
        export const Component = async () => {
          return <div>Hello, world!</div>;
        }
      `,
      errors: [
        {
          messageId: 'invalidComponentDefinition',
        },
      ],
    }),
    normalizeTestCase({
      filename: 'Component.tsx',
      code: `
        export const Component: FC = () => <div>Hello, world!</div>;
      `,
      errors: [
        {
          messageId: 'invalidComponentDefinition',
        },
      ],
    }),
    normalizeTestCase({
      filename: 'Component.tsx',
      code: `
        export const Component = () => <div>Hello, world!</div>;
      `,
      errors: [
        {
          messageId: 'invalidComponentDefinition',
        },
      ],
    }),
  ],
});
