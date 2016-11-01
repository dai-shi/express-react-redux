#!/usr/bin/env node

const program = require('commander');

program
  .command('create <template>')
  .description('create an app')
  .action(() => {
    console.log('TODO');
  });

if (!process.argv.slice(2).length) {
  program.help();
}

program.parse(process.argv);
