/* eslint-env jest */

const path = require('path');
const fs = require('fs-extra');
const execSync = require('child_process').execSync;

const cli = path.join(__dirname, '../lib/cli.js');

describe('cli import test', () => {
  const encoding = 'utf8';
  let dir;
  beforeEach(() => {
    dir = fs.mkdtempSync('./temp-');
  });
  afterEach(() => {
    fs.removeSync(dir);
  });

  it('invoke without commands', () => {
    const stdout = execSync(`${cli} --help`, { cwd: dir, encoding });
    expect(stdout.indexOf('Usage') >= 0).toBe(true);
  });

  it('invoke import tiny-todos', () => {
    const cwd = path.join(dir, 'app');
    fs.mkdirSync(cwd);
    execSync('npm init -y', { cwd });
    const stdout = execSync(`${cli} import tiny-todos`, { cwd, encoding });
    expect(stdout.length).toBe(0);
    const pjson = fs.readFileSync(path.join(cwd, 'package.json'), { encoding });
    expect(pjson.indexOf('express-react-redux build-client') >= 0).toBe(true);
    const appjs = fs.readFileSync(path.join(cwd, 'src/server/app.js'), { encoding });
    expect(appjs.indexOf('app.use(require(\'express-react-redux\')());') >= 0).toBe(true);
  });
});

