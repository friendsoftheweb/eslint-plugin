import fs from 'node:fs';
import * as test from 'node:test';

import {
  type InvalidTestCase,
  RuleTester,
  type ValidTestCase,
} from '@typescript-eslint/rule-tester';
import sinon from 'sinon';

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
  let existsSyncStub;
  let readFileSyncStub;

  test.before(() => {
    existsSyncStub = sinon.stub(fs, 'existsSync').callsFake((filePath) => {
      const cwd = process.cwd();

      const relativeFilePath = filePath.startsWith(cwd)
        ? filePath.slice(cwd.length).replace(/^\//, '')
        : filePath;

      return fakeFileSystem[relativeFilePath] != null;
    });

    readFileSyncStub = sinon.stub(fs, 'readFileSync').callsFake((filePath) => {
      const cwd = process.cwd();

      const relativeFilePath = filePath.startsWith(cwd)
        ? filePath.slice(cwd.length).replace(/^\//, '')
        : filePath;

      return fakeFileSystem[relativeFilePath];
    });
  });

  test.after(() => {
    existsSyncStub?.reset();
    readFileSyncStub?.reset();
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
