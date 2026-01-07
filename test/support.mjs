import fs from 'node:fs';

import sinon from 'sinon';
import { RuleTester } from 'eslint';

export const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2018 },
});

/**
 *
 * @param {Record<string, string>} fakeFileSystem
 */
export function stubFileSystem(fakeFileSystem) {
  sinon.stub(fs, 'existsSync').callsFake((filePath) => {
    const relativeFilePath = filePath
      .replace(process.cwd(), '')
      .replace(/^\//, '');

    return fakeFileSystem[relativeFilePath] != null;
  });

  sinon.stub(fs, 'readFileSync').callsFake((filePath) => {
    const relativeFilePath = filePath
      .replace(process.cwd(), '')
      .replace(/^\//, '');

    return fakeFileSystem[relativeFilePath];
  });
}

export function restoreFileSystem() {
  sinon.restore();
}
