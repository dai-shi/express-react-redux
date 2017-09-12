/* eslint-env jest */
/* global jasmine */

const path = require('path');
const http = require('http');
const express = require('express');
const request = require('request');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const main = require('../lib/main.js');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 3 * 60 * 1000;

const webpackDevConfig = require('../lib/webpack-dev-config.js');

webpackDevConfig[0].entry[2] = path.join(__dirname, 'files/src/client/index.js');
webpackDevConfig[1].entry[2] = path.join(__dirname, 'files/src/client/App.jsx');
webpackDevConfig[2].entry[2] = path.join(__dirname, 'files/src/client/reducer.js');
webpackDevConfig[0].plugins[1] = new HtmlWebpackPlugin({
  filename: 'index.html',
  template: path.join(__dirname, 'files/src/client/index.html'),
});

describe('middleware unit test', () => {
  it('call it with minimal option', (done) => {
    main({
      webpackDevConfig,
      webpackDevBuildCallback: () => done(),
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
      webpackDevConfig,
      webpackDevBuildCallback: () => done(),
    }));
    server = http.createServer(app);
    server.listen(() => {
      port = server.address().port;
    });
  });

  it('get /', (done) => {
    request.get(`http://localhost:${port}/`, (err, res, body) => {
      expect(err).toBeFalsy();
      expect(body).toContain('script');
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });
});

describe('middleware run test with / route SSR', () => {
  'use strict';

  let server;
  let port;
  beforeAll((done) => {
    const app = express();
    app.use(main({
      webpackDevConfig,
      webpackDevBuildCallback: () => done(),
      indexSSR: true,
    }));
    server = http.createServer(app);
    server.listen(() => {
      port = server.address().port;
    });
  });

  it('get /', (done) => {
    request.get(`http://localhost:${port}/`, (err, res, body) => {
      expect(body).toContain('<h1');
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });
});

describe('middleware run test with async function to populate the Store before SSR', () => {
  'use strict';

  let server;
  let port;
  beforeAll((done) => {
    const app = express();
    app.use(main({
      webpackDevConfig,
      webpackDevBuildCallback: () => done(),
      indexSSR: true,
      beforeRenderPromise: req => new Promise((resolve) => {
        setTimeout(() => {
          resolve({ type: 'ADD_TODO', todo: `Path ${req.url} waits async state before render 👏 ` });
        }, 2000);
      }),
    }));
    server = http.createServer(app);
    server.listen(() => {
      port = server.address().port;
    });
  });

  it('get /', (done) => {
    request.get(`http://localhost:${port}/about`, (err, res, body) => {
      expect(body).toContain('Path \\u002Fabout waits async state before render 👏');
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });
});
