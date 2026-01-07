import type { RuleModule } from '@typescript-eslint/utils/ts-eslint';
import type {
  ArrowFunctionExpression,
  FunctionDeclaration,
  VariableDeclarator,
} from 'estree';

const reactNamedFuncComponentsRule: RuleModule<'invalidComponentDefinition'> = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'enforce use of named functions when defining React components',
      url: 'https://github.com/friendsoftheweb/eslint-plugin#friendsofthewebreact-named-func-components',
    },
    schema: [],
    messages: {
      invalidComponentDefinition:
        'React components must be defined using named functions',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      VariableDeclarator(node) {
        if (!isReactComponent(node as VariableDeclarator)) {
          return;
        }

        context.report({
          node,
          messageId: 'invalidComponentDefinition',
        });
      },
    };
  },
};

export default reactNamedFuncComponentsRule;

function isReactComponent(
  node: FunctionDeclaration | ArrowFunctionExpression | VariableDeclarator,
) {
  if (node.type === 'VariableDeclarator') {
    if (node.init == null) {
      return false;
    }

    if (node.init.type !== 'ArrowFunctionExpression') {
      return false;
    }

    if (node.id.type !== 'Identifier' || !/^[A-Z]/.test(node.id.name)) {
      return false;
    }

    return isReactComponent(node.init);
  } else if (node.type === 'FunctionDeclaration') {
    if (node.id != null && !/^[A-Z]/.test(node.id.name)) {
      return false;
    }
  }

  if (node.body.type === 'BlockStatement') {
    for (const statement of node.body.body) {
      if (
        statement.type === 'ReturnStatement' &&
        statement.argument != null &&
        // @ts-expect-error: ESTree types are missing JSXElement
        (statement.argument.type === 'JSXElement' ||
          // @ts-expect-error: ESTree types are missing JSXFragment
          statement.argument.type === 'JSXFragment' ||
          (statement.argument.type === 'Literal' &&
            statement.argument.value === null))
      ) {
        return true;
      }
    }
    // @ts-expect-error: ESTree types are missing JSXElement
  } else if (node.body.type === 'JSXElement') {
    return true;
  } else if (
    // @ts-expect-error: ESTree types are missing ParenthesizedExpression
    node.body.type === 'ParenthesizedExpression' &&
    // @ts-expect-error: ESTree types are missing JSXElement
    node.body.expression?.type === 'JSXElement'
  ) {
    return true;
  }

  return false;
}
