const _ = require('lodash');
const serveStatic = require('serve-static');
const app = require('./app-emulation');

const defaultOptions = {
  isProductionMode: () => process.env.NODE_ENV === 'production',
  isIndexHtmlUrl: url => url === '/' || /\.html?$/.test(url) || !/\.\w+$/.test(url),
  dirBuildAssets: './build/assets',
  optsServeAssets: {},
  dirBuildIndex: './build/client',
  optsServeIndex: { redirect: false, fallthrough: false },
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

  // STEP-02 serve assets
  if (options.isProductionMode()) {
    app.use(serveStatic(options.dirBuildAssets, options.optsServeAssets));
  } else {
    // TODO
  }

  // STEP-03 serve index.html
  if (options.isProductionMode()) {
    app.use(serveStatic(options.dirBuildIndex, options.optsServeIndex));
  } else {
    // TODO
  }

  return (req, res, next) => {
    app.handle(0, req, res, next);
  };
}

module.exports = middleware;
