import validServerActionsPathRule from '../../src/rules/valid-server-actions-path.ts';
import { ruleTester } from '../support.ts';

ruleTester.run('valid-server-actions-path', validServerActionsPathRule, {
  valid: [
    {
      filename: 'app/_actions.ts',
      code: "'use server';\n\nexport async function action() {}",
    },
    {
      filename: 'app/_actions.js',
      code: "'use server';\n\nexport async function action() {}",
    },
    {
      filename: 'app/_actions/checkout.ts',
      code: "'use server';\n\nexport async function action() {}",
    },
    {
      filename: 'app/_actions/checkout.js',
      code: "'use server';\n\nexport async function action() {}",
    },
    {
      filename: 'app/_actions/checkout/payment.ts',
      code: "'use server';\n\nexport async function action() {}",
    },
    {
      filename: 'app/_actions/checkout/payment.js',
      code: "'use server';\n\nexport async function action() {}",
    },
    {
      filename: 'app/checkout/_actions.ts',
      code: "'use server';\n\nexport async function action() {}",
    },
    {
      filename: 'app/checkout/_actions.js',
      code: "'use server';\n\nexport async function action() {}",
    },
    {
      filename: 'app/actions.ts',
      code: 'export async function action() {}',
    },
    {
      filename: 'app/actions.js',
      code: 'export async function action() {}',
    },
  ],
  invalid: [
    {
      filename: 'src/_actions.ts',
      code: "'use server';\n\nexport async function action() {}",
      errors: [
        {
          messageId: 'invalidPath',
        },
      ],
    },
    {
      filename: 'src/_actions.js',
      code: "'use server';\n\nexport async function action() {}",
      errors: [
        {
          messageId: 'invalidPath',
        },
      ],
    },
    {
      filename: 'app/checkout/actions.ts',
      code: "'use server';\n\nexport async function action() {}",
      errors: [
        {
          messageId: 'invalidPath',
        },
      ],
    },
    {
      filename: 'app/checkout/actions.js',
      code: "'use server';\n\nexport async function action() {}",
      errors: [
        {
          messageId: 'invalidPath',
        },
      ],
    },
    {
      filename: 'app/checkout/actions/checkout.ts',
      code: "'use server';\n\nexport async function action() {}",
      errors: [
        {
          messageId: 'invalidPath',
        },
      ],
    },
    {
      filename: 'app/checkout/actions/checkout.js',
      code: "'use server';\n\nexport async function action() {}",
      errors: [
        {
          messageId: 'invalidPath',
        },
      ],
    },
  ],
});
