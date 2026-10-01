import type { TSESTree } from '@typescript-eslint/utils';
import type {
  RuleFixer,
  RuleModule,
  SourceCode,
} from '@typescript-eslint/utils/ts-eslint';
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
    fixable: 'code',
    schema: [],
    messages: {
      invalidComponentDefinition:
        'React components must be defined using named functions',
    },
  },
  defaultOptions: [],
  create(context) {
    const { sourceCode } = context;

    return {
      VariableDeclarator(node) {
        if (!isReactComponent(node as VariableDeclarator)) {
          return;
        }

        context.report({
          node,
          messageId: 'invalidComponentDefinition',
          fix: (fixer) => buildFix(fixer, sourceCode, node),
        });
      },
    };
  },
};

export default reactNamedFuncComponentsRule;

/**
 * Converts `const Foo = (props) => ...` into `function Foo(props) { ... }`.
 * Returns `null` (no fix) whenever the conversion could change behavior or
 * drop information, e.g. a type annotation on the variable (`FC<Props>`),
 * multiple declarators, or an arrow function using `this`/`arguments`.
 */
function buildFix(
  fixer: RuleFixer,
  sourceCode: Readonly<SourceCode>,
  node: TSESTree.VariableDeclarator,
) {
  const declaration = node.parent;
  const arrow = node.init;

  if (
    declaration.type !== 'VariableDeclaration' ||
    declaration.declarations.length !== 1 ||
    declaration.declare ||
    arrow == null ||
    arrow.type !== 'ArrowFunctionExpression' ||
    node.id.type !== 'Identifier' ||
    node.id.typeAnnotation != null
  ) {
    return null;
  }

  const usesFunctionScope = sourceCode
    .getTokens(arrow)
    // Match on value only: tokens inside JSX expressions are typed as
    // `JSXIdentifier`. A false positive just means no autofix.
    .some((token) => token.value === 'this' || token.value === 'arguments');

  if (usesFunctionScope) {
    return null;
  }

  const arrowToken = sourceCode.getTokenBefore(arrow.body, {
    filter: (token) => token.type === 'Punctuator' && token.value === '=>',
  });

  if (arrowToken == null) {
    return null;
  }

  let header = sourceCode.text.slice(arrow.range[0], arrowToken.range[0]);

  if (arrow.async) {
    header = header.replace(/^async\s*/, '');
  }

  const bodyText = sourceCode.text.slice(arrowToken.range[1], arrow.range[1]);

  const body =
    arrow.body.type === 'BlockStatement'
      ? bodyText.trim()
      : `{ return ${bodyText.trim()}; }`;

  return fixer.replaceText(
    declaration,
    `${arrow.async ? 'async ' : ''}function ${node.id.name}${header.trim()} ${body}`,
  );
}

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
