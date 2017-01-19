/* eslint-env jest */

const path = require('path');
const fs = require('fs-extra');
const exec = require('child_process').exec;

const cli = path.join(__dirname, '../lib/cli.js');

describe('cli import test', () => {
  let cwd;
  beforeEach(() => {
    cwd = fs.mkdtempSync('./temp-');
  });
  afterEach(() => {
    fs.removeSync(cwd);
  });
  it('call it without commands', (done) => {
    exec(cli, { cwd }, (error, stdout, stderr) => {
      expect(error).toBeFalsy();
      expect(stderr).toBeFalsy();
      expect(stdout.indexOf('Usage') >= 0).toBe(true);
      done();
    });
  });
});

