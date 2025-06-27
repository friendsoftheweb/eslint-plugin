import path from 'node:path';
import fs from 'node:fs';

import { parse } from 'postcss';
import selectorParser from 'postcss-selector-parser';

/** @type {import('eslint').JSRuleDefinition} */
export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'enforce that class names used from an imported CSS module exist in the module file',
    },
    schema: [],
    messages: {
      relativePath:
        'CSS module import "{{importPath}}" should be a relative path',
      defaultImport:
        'CSS module import "{{importPath}}" should have a default import',
      onlyDefaultImport:
        'CSS module import "{{importPath}}" should have only a default import',
      fileDoesNotExist:
        'CSS module file "{{absoluteImportPath}}" does not exist',
      classDoesNotExist:
        'Class "{{className}}" does not exist in the CSS module imported as "{{objectName}}"',
    },
  },
  create(context) {
    const classNames = {};

    return {
      ImportDeclaration(node) {
        if (
          typeof node.source.value !== 'string' ||
          !node.source.value.endsWith('.module.css')
        ) {
          return;
        }

        const importPath = node.source.value;

        if (!(importPath.startsWith('./') || importPath.startsWith('../'))) {
          context.report({
            node,
            messageId: 'relativePath',
            data: { importPath },
          });

          return;
        }

        if (node.specifiers.length === 0) {
          context.report({
            node,
            messageId: 'defaultImport',
            data: { importPath },
          });

          return;
        }

        if (node.specifiers.length > 1) {
          context.report({
            node,
            messageId: 'onlyDefaultImport',
            data: { importPath },
          });

          return;
        }

        const defaultImportSpecifier = node.specifiers.find(
          (specifier) => specifier.type === 'ImportDefaultSpecifier',
        );

        if (defaultImportSpecifier == null) {
          context.report({
            node,
            messageId: 'onlyDefaultImport',
            data: { importPath },
          });

          return;
        }

        const dirname = path.dirname(context.physicalFilename);
        const absoluteImportPath = path.resolve(dirname, importPath);

        if (!fs.existsSync(absoluteImportPath)) {
          context.report({
            node,
            messageId: 'fileDoesNotExist',
            data: { absoluteImportPath },
          });

          return;
        }

        const importName = defaultImportSpecifier.local.name;

        classNames[importName] = new Set();

        const cssModuleContent = fs.readFileSync(absoluteImportPath, 'utf8');
        const root = parse(cssModuleContent);

        for (const node of root.nodes) {
          if (node.type === 'rule') {
            selectorParser(function transform(selectors) {
              selectors.walkClasses((classNode) => {
                classNames[importName].add(classNode.value);
              });
            }).processSync(node.selector);
          } else if (
            node.type === 'atrule' &&
            (node.name === 'media' || node.name === 'container')
          ) {
            for (const childNode of node.nodes) {
              if (childNode.type !== 'rule') {
                continue;
              }

              selectorParser(function transform(selectors) {
                selectors.walkClasses((classNode) => {
                  classNames[importName].add(classNode.value);
                });
              }).processSync(childNode.selector);
            }
          }
        }
      },
      MemberExpression(node) {
        if (node.object.type !== 'Identifier') {
          return;
        }

        if (classNames[node.object.name] == null) {
          return;
        }

        const objectName = node.object.name;

        if (node.property.type === 'Identifier') {
          const className = node.property.name;

          if (!classNames[objectName].has(className)) {
            context.report({
              node,
              messageId: 'classDoesNotExist',
              data: { className, objectName },
            });
          }

          return;
        }

        if (
          node.property.type === 'Literal' &&
          typeof node.property.value === 'string'
        ) {
          const className = node.property.value;

          if (!classNames[objectName].has(className)) {
            context.report({
              node,
              messageId: 'classDoesNotExist',
              data: { className, objectName },
            });
          }
        }
      },
      VariableDeclarator(node) {
        if (node.id.type !== 'ObjectPattern') {
          return;
        }

        if (node.init?.type !== 'Identifier') {
          return;
        }

        const objectName = node.init.name;

        if (classNames[objectName] == null) {
          return;
        }

        for (const property of node.id.properties) {
          if (property.type !== 'Property') {
            continue;
          }

          if (property.key.type !== 'Identifier') {
            continue;
          }

          const className = property.key.name;

          if (!classNames[objectName].has(className)) {
            context.report({
              node: property,
              messageId: 'classDoesNotExist',
              data: { className, objectName },
            });
          }
        }
      },
    };
  },
};
