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
      '-I',
      '-f',
      'package.json',
      'this.scripts.build="express-react-redux build-client src/client build/client";this.scripts.start="node src/server/app.js"',
    ]);
    const dir = path.join(__dirname, '../templates', template);
    const depth = dir.split(path.sep).length;
    copyfiles([`${dir}/**/*`, '.'], depth, (err) => {
      if (err) console.error(err);
    });
  });

program
  .command('build-client <src> <dst>')
  .description('build client code by webpack')
  .action((src, dst) => {
    const webpackConfig = require('./webpack-config.js')({
      dirSourceClient: src,
      dirBuildClient: dst,
    });
    const compiler = require('webpack')(webpackConfig);

    compiler.run((err) => {
      if (err) console.error(err);
    });
  });

if (!process.argv.slice(2).length) {
  program.help();
}

program.parse(process.argv);
