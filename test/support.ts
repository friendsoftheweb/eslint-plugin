import fs from 'node:fs';
import * as test from 'node:test';

import {
  type InvalidTestCase,
  RuleTester,
  type ValidTestCase,
} from '@typescript-eslint/rule-tester';
import sinon, { type SinonStub } from 'sinon';

RuleTester.afterAll = test.after;
RuleTester.describe = test.describe;
RuleTester.it = test.it;
RuleTester.itOnly = test.it.only;

export const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2018,
  },
});

export function stubFileSystem(fakeFileSystem: Record<string, string>) {
  let existsSyncStub: SinonStub;
  let readFileSyncStub: SinonStub;

  test.before(() => {
    existsSyncStub = sinon.stub(fs, 'existsSync').callsFake((filePath) => {
      const cwd = process.cwd();

      const stringFilePath =
        typeof filePath === 'string' ? filePath : filePath.toString();

      const relativeFilePath = stringFilePath.startsWith(cwd)
        ? stringFilePath.slice(cwd.length).replace(/^\//, '')
        : stringFilePath;

      return fakeFileSystem[relativeFilePath] != null;
    });

    readFileSyncStub = sinon.stub(fs, 'readFileSync').callsFake((filePath) => {
      const cwd = process.cwd();

      const stringFilePath =
        typeof filePath === 'string' ? filePath : filePath.toString();

      const relativeFilePath = stringFilePath.startsWith(cwd)
        ? stringFilePath.slice(cwd.length).replace(/^\//, '')
        : stringFilePath;

      return fakeFileSystem[relativeFilePath];
    });
  });

  test.after(() => {
    existsSyncStub?.restore();
    readFileSyncStub?.restore();
  });
}

export function normalizeTestCase<
  MessageIds extends string,
  Options extends readonly unknown[],
  TestCase extends
    | ValidTestCase<Options>
    | InvalidTestCase<MessageIds, Options>,
>(options: TestCase): TestCase {
  const [line1, line2, ...rest] = options.code.split('\n');

  if (line2 == null) {
    return {
      ...options,
      code: line1.trim(),
    };
  }

  if (line1.trim() === '') {
    const indent = line2.match(/^\s*/)[0]?.length ?? 0;

    return {
      ...options,
      code: [line2, ...rest]
        .map((line) => line.slice(indent))
        .join('\n')
        .trim(),
    };
  }

  return options;
}
