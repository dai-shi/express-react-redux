#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const copyfiles = require('copyfiles');
const json = require('json');

program
  .command('import <template>')
  .description('import an app')
  .action((template) => {
    json.main([
      null,
      null,
      '-q',
      '-I',
      '-f',
      'package.json',
      '-e',
      'this.scripts.build="express-react-redux build-client";this.scripts.start="node src/server"',
    ]);
    const dir = path.join(__dirname, '../templates', template);
    const depth = dir.split(path.sep).length;
    copyfiles([`${dir}/**/*`, '.'], depth, (err) => {
      if (err) console.error(err);
    });
  });

program
  .command('build-client')
  .description('build client code by webpack')
  .action(() => {
    const webpackProdConfig = require('./webpack-prod-config.js');
    const compiler = require('webpack')(webpackProdConfig);

    compiler.run((err) => {
      if (err) console.error(err);
    });
  });

if (!process.argv.slice(2).length) {
  program.help();
}

program.parse(process.argv);
