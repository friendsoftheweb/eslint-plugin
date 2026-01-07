import reactNamedFuncComponents from '../../src/rules/react-named-func-components.mjs';
import { normalizeTest, ruleTester } from '../support.mjs';

ruleTester.run('react-named-func-components', reactNamedFuncComponents, {
  valid: [
    normalizeTest({
      filename: 'Component.tsx',
      code: `
        function Component() {
          return <div>Hello, world!</div>;
        }
      `,
    }),
    normalizeTest({
      filename: 'Component.tsx',
      code: `
        export function Component() {
          return <div>Hello, world!</div>;
        }
      `,
    }),
    normalizeTest({
      filename: 'Component.tsx',
      code: `
        export default function() {
          return <div>Hello, world!</div>;
        }
      `,
    }),
    normalizeTest({
      filename: 'Component.tsx',
      code: `
        export async function Component() {
          return <div>Hello, world!</div>;
        }
      `,
    }),
    normalizeTest({
      filename: 'Component.tsx',
      code: `
        const Component = forwardRef(() => {
          return <div>Hello, world!</div>;
        });
      `,
    }),
  ],
  invalid: [
    normalizeTest({
      filename: 'Component.tsx',
      code: `
        const Component: FC = () => {
          return <div>Hello, world!</div>;
        }
      `,
      errors: 1,
    }),
    normalizeTest({
      filename: 'Component.tsx',
      code: `
        const Component = () => {
          return <div>Hello, world!</div>;
        }
      `,
      errors: 1,
    }),
    normalizeTest({
      filename: 'Component.tsx',
      code: `
        const Component: FC = async () => {
          return <div>Hello, world!</div>;
        }
      `,
      errors: 1,
    }),
    normalizeTest({
      filename: 'Component.tsx',
      code: `
        const Component = async () => {
          return <div>Hello, world!</div>;
        }
      `,
      errors: 1,
    }),
    normalizeTest({
      filename: 'Component.tsx',
      code: `
        const Component: FC = () => {
          return null;
        }
      `,
      errors: 1,
    }),
    normalizeTest({
      filename: 'Component.tsx',
      code: `
        export const Component: FC = () => {
          return <div>Hello, world!</div>;
        }
      `,
      errors: 1,
    }),
    normalizeTest({
      filename: 'Component.tsx',
      code: `
        export const Component = () => {
          return <div>Hello, world!</div>;
        }
      `,
      errors: 1,
    }),
    normalizeTest({
      filename: 'Component.tsx',
      code: `
        export const Component: FC = async () => {
          return <div>Hello, world!</div>;
        }
      `,
      errors: 1,
    }),
    normalizeTest({
      filename: 'Component.tsx',
      code: `
        export const Component = async () => {
          return <div>Hello, world!</div>;
        }
      `,
      errors: 1,
    }),
  ],
});
