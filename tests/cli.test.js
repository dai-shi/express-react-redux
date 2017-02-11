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
    expect(stdout).toMatch(/Usage/);
  });

  it('invoke import tiny-todos', () => {
    const cwd = path.join(dir, 'app');
    fs.mkdirSync(cwd);
    execSync('npm init -y', { cwd });
    const stdout = execSync(`${cli} import tiny-todos`, { cwd, encoding });
    expect(stdout.length).toBe(0);
    const pjson = fs.readFileSync(path.join(cwd, 'package.json'), { encoding });
    expect(pjson).toMatch(/express-react-redux build-client/);
    const appjs = fs.readFileSync(path.join(cwd, 'src/server/index.js'), { encoding });
    expect(appjs).toMatch(/app.use\(require\('express-react-redux'\)\(\)\);/);
  });

  it('invoke build command', () => {
    const cwd = path.join(dir, 'app');
    fs.mkdirSync(cwd);
    execSync('npm init -y', { cwd });
    execSync(`${cli} import tiny-todos`, { cwd, encoding });
    const stdout = execSync(`${cli} build-client src/client build/client`, { cwd, encoding });
    expect(stdout.length).toBe(0);
    const files = fs.readdirSync(path.join(cwd, 'build/client'), { encoding });
    expect(files.length).toBe(2);
    expect(files.join(' ')).toMatch(/index\.js/);
    expect(files.join(' ')).toMatch(/index\.html/);
  });
});

