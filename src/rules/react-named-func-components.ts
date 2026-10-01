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
 * multiple declarators, or an arrow function using `this`/`arguments`/`super`/`new.target`.
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

  const tokens = sourceCode.getTokens(arrow);

  // Match on value only: tokens inside JSX expressions are typed as
  // `JSXIdentifier`. A false positive just means no autofix.
  const usesFunctionScope = tokens.some(
    (token, index) =>
      token.value === 'this' ||
      token.value === 'arguments' ||
      token.value === 'super' ||
      (token.value === 'new' &&
        tokens[index + 1]?.value === '.' &&
        tokens[index + 2]?.value === 'target'),
  );

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

  header = header.trim();

  // `props => ...` has no parentheses, but `function Foo props {}` is invalid
  if (/^[\w$]+$/.test(header)) {
    header = `(${header})`;
  }

  const bodyText = sourceCode.text
    .slice(arrowToken.range[1], arrow.range[1])
    .trim();

  // Parenthesize so a comment or newline after `=>` can't end up directly
  // after `return`, where automatic semicolon insertion would break it.
  const isParenthesized = bodyText.startsWith('(') && bodyText.endsWith(')');

  const body =
    arrow.body.type === 'BlockStatement'
      ? bodyText
      : `{ return ${isParenthesized ? bodyText : `(${bodyText})`}; }`;

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
