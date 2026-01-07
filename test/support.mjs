import fs from 'node:fs';

import sinon from 'sinon';
import { RuleTester } from 'eslint';

export const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2018 },
});

/**
 * @param {Record<string, string>} fakeFileSystem
 * @param {() => void} runTests
 */
export function stubFileSystem(fakeFileSystem, runTests) {
  let existsSyncStub;
  let readFileSyncStub;

  try {
    existsSyncStub = sinon.stub(fs, 'existsSync').callsFake((filePath) => {
      const relativeFilePath = filePath
        .replace(process.cwd(), '')
        .replace(/^\//, '');

      return fakeFileSystem[relativeFilePath] != null;
    });

    readFileSyncStub = sinon.stub(fs, 'readFileSync').callsFake((filePath) => {
      const relativeFilePath = filePath
        .replace(process.cwd(), '')
        .replace(/^\//, '');

      return fakeFileSystem[relativeFilePath];
    });

    runTests();
  } finally {
    if (existsSyncStub != null) {
      existsSyncStub.restore();
    }

    if (readFileSyncStub != null) {
      readFileSyncStub.restore();
    }
  }
}
