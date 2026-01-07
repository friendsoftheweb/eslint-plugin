/** @type {import('eslint').JSRuleDefinition} */
export default {
  meta: {
    type: 'problem',
    fixable: 'code',
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
  create(context) {
    return {
      VariableDeclarator(node) {
        if (!isReactComponent(node)) {
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

/**
 *
 * @param {import('estree').FunctionDeclaration | import('estree').ArrowFunctionExpression | import('estree').VariableDeclarator} node
 * @returns {boolean}
 */
function isReactComponent(node) {
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

  for (const statement of node.body.body) {
    if (
      statement.type === 'ReturnStatement' &&
      statement.argument != null &&
      (statement.argument.type === 'JSXElement' ||
        (statement.argument.type === 'Literal' &&
          statement.argument.value === null))
    ) {
      return true;
    }
  }

  return false;
}
