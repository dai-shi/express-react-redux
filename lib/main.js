const path = require('path');
const _ = require('lodash');
const serveStatic = require('serve-static');
const app = require('./app-emulation.js');

const defaultOptions = {
  isProductionMode: () => process.env.NODE_ENV === 'production',
  isIndexHtmlUrl: url => url === '/' || /\.html?$/.test(url) || !/\.\w+$/.test(url),
  dirSourceClient: './src/client',
  dirBuildClient: './build/client',
  optsServeClient: { redirect: false },
  webpackConfig: require('./webpack-config.js'),
  webpackDevOptions: { noInfo: true, publicPath: '/' },
  webpackDevBuildCallback: () => console.log('webpack dev build done.'),
};


function middleware(options) {
  options = _.merge(defaultOptions, options || {});

  // STEP-01 treat fallback urls as index.html
  app.use((req, res, next) => {
    if (options.isIndexHtmlUrl(req.url, req)) {
      req.url = '/index.html';
    }
    next();
  });

  // STEP-02 serve assets and index.html
  if (options.isProductionMode()) {
    app.use(serveStatic(options.dirBuildClient, options.optsServeClient));
  } else {
    const webpackConfig = typeof options.webpackConfig === 'function' ?
      options.webpackConfig(options) : options.webpackConfig;
    const compiler = require('webpack')(webpackConfig);

    compiler.plugin('done', options.webpackDevBuildCallback);
    app.use(require('webpack-dev-middleware')(compiler, options.webpackDevOptions));

    app.get('/index.html', (req, res, next) => {
      const filename = path.join(compiler.outputPath, 'index.html');
      compiler.outputFileSystem.readFile(filename, (err, result) => {
        if (err) {
          next(err);
        } else {
          res.set('content-type', 'text/html');
          res.send(result);
          res.end();
        }
      });
    });
    app.use(require('webpack-hot-middleware')(compiler));
  }

  return (req, res, next) => {
    app.handle(0, req, res, next);
  };
}

module.exports = middleware;
