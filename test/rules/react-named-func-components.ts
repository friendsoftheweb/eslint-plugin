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
    ...[
      // Type annotation on the variable: reported but not auto-fixed
      [
        `
        const Component: FC = () => {
          return <div>Hello, world!</div>;
        }
      `,
        null,
      ],
      [
        `
        export const Component: FC = async () => <div>Hello, world!</div>;
      `,
        null,
      ],
      // Uses `this` / `arguments`: not auto-fixed
      [
        `
        const Component = () => {
          return <div>{arguments.length}</div>;
        }
      `,
        null,
      ],
      [
        `
        const Component = () => {
          return <div>{new.target}</div>;
        }
      `,
        null,
      ],
      [
        `
        const Component = () => {
          return <div>{super.name}</div>;
        }
      `,
        null,
      ],
      // Multiple declarators: not auto-fixed
      [
        `
        const Component = () => <div />, other = 1;
      `,
        null,
      ],
      [
        `
        const Component = () => {
          return <div>Hello, world!</div>;
        }
      `,
        `
        function Component() {
          return <div>Hello, world!</div>;
        }
      `,
      ],
      [
        `
        const Component = (props) => {
          return <>{props.children}</>;
        };
      `,
        `
        function Component(props) {
          return <>{props.children}</>;
        }
      `,
      ],
      [
        `
        const Component = async () => {
          return <div>Hello, world!</div>;
        }
      `,
        `
        async function Component() {
          return <div>Hello, world!</div>;
        }
      `,
      ],
      [
        `
        const Component = () => {
          return null;
        }
      `,
        `
        function Component() {
          return null;
        }
      `,
      ],
      [
        `
        export const Component = () => {
          return <div>Hello, world!</div>;
        }
      `,
        `
        export function Component() {
          return <div>Hello, world!</div>;
        }
      `,
      ],
      [
        `
        export const Component = async () => {
          return <div>Hello, world!</div>;
        }
      `,
        `
        export async function Component() {
          return <div>Hello, world!</div>;
        }
      `,
      ],
      [
        `
        export const Component = () => <div>Hello, world!</div>;
      `,
        `
        export function Component() { return (<div>Hello, world!</div>); }
      `,
      ],
      [
        `
        const Component = props => <div />;
      `,
        `
        function Component(props) { return (<div />); }
      `,
      ],
      [
        `
        const Component = async props => <div />;
      `,
        `
        async function Component(props) { return (<div />); }
      `,
      ],
      [
        `
        const Component = () => // comment
          <div />;
      `,
        `
        function Component() { return (// comment
          <div />); }
      `,
      ],
      [
        `
        export const Component = ({ name }) => (
          <div>Hello, {name}!</div>
        );
      `,
        `
        export function Component({ name }) { return (
          <div>Hello, {name}!</div>
        ); }
      `,
      ],
    ].map(([code, output]) =>
      normalizeTestCase({
        filename: 'Component.tsx',
        code,
        output:
          output == null ? null : normalizeTestCase({ code: output }).code,
        errors: [{ messageId: 'invalidComponentDefinition' as const }],
      }),
    ),
    normalizeTestCase({
      filename: 'Component.tsx',
      code: `
        export const Component = <T,>(props: Props<T>): JSX.Element => {
          return <div>Hello, world!</div>;
        }
      `,
      output: normalizeTestCase({
        code: `
        export function Component<T,>(props: Props<T>): JSX.Element {
          return <div>Hello, world!</div>;
        }
      `,
      }).code,
      errors: [{ messageId: 'invalidComponentDefinition' }],
    }),
  ],
});
