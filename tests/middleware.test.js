/* eslint-env jest */
/* global jasmine */

const path = require('path');
const http = require('http');
const express = require('express');
const request = require('request');

const main = require('../lib/main.js');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60 * 1000;

describe('middleware unit test', () => {
  it('call it with minimal option', (done) => {
    main({
      dirSourceClient: path.join(__dirname, 'files/src/client'),
      dirBuildClient: path.join(__dirname, 'files/build/client'),
      webpackDevBuildCallback: done,
    });
  });
});

describe('middleware run test', () => {
  'use strict';

  let server;
  let port;
  beforeAll((done) => {
    const app = express();
    app.use(main({
      dirSourceClient: path.join(__dirname, 'files/src/client'),
      dirBuildClient: path.join(__dirname, 'files/build/client'),
      webpackDevBuildCallback: done,
    }));
    server = http.createServer(app);
    server.listen(() => {
      port = server.address().port;
    });
  });

  it('get index.html', (done) => {
    request.get(`http://localhost:${port}/index.html`, (err, res, body) => {
      expect(err).toBeFalsy();
      expect(body).toContain('script');
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });
});
