/* eslint-env jest */

const path = require('path');
const express = require('express');
const request = require('request');

const main = require('../lib/main.js');

describe('middleware unit test', () => {
  it('call it without option', () => {
    main();
  });
});

describe('middleware run test', () => {
  'use strict';

  let server;
  const port = 13131;
  beforeAll(() => {
    const app = express();
    app.use(main({
      dirSourceClient: path.join(__dirname, 'files/src/client'),
      dirBuildClient: path.join(__dirname, 'files/build/client'),
    }));
    server = app.listen(port);
  });

  it('get index.html', (done) => {
    request(`http://localhost:${port}/index.html`, (err, res, body) => {
      expect(body).toBeTruthy();
      done();
    });
  });

  afterAll(() => {
    server.close();
  });
});
