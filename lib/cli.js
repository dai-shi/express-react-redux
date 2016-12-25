#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const copyfiles = require('copyfiles');

program
  .command('import <template>')
  .description('import an app')
  .action((template) => {
    const dir = path.join(__dirname, '../templates', template);
    const depth = dir.split(path.sep).length;
    copyfiles([`${dir}/**/*`, '.'], depth, (err) => {
      if (err) console.error(err);
    });
  });

if (!process.argv.slice(2).length) {
  program.help();
}

program.parse(process.argv);
