const path = require('path');
const _ = require('lodash');
const serveStatic = require('serve-static');
const app = require('./app-emulation.js');
const { createElement: h } = require('react');
const { renderToString } = require('react-dom/server');
const { StaticRouter } = require('react-router-dom');
const { Provider } = require('react-redux');


const defaultOptions = {
  isProductionMode: () => process.env.NODE_ENV === 'production',
  isRoutingUrl: (url, req) => (/\.html?$/.test(url) || !/\.\w+$/.test(url)) && req.header('accept') !== 'text/event-stream',
  dirSourceClient: './src/client',
  dirBuildClient: './build/client',
  fileIndexHtml: 'index.html',
  fileIndexJs: 'index.js',
  optsServeClient: { redirect: false },
  webpackConfig: require('./webpack-config.js'),
  webpackDevOptions: { noInfo: true, publicPath: '/' },
  webpackDevBuildCallback: () => console.log('webpack dev build done.'),
};


function middleware(options = {}) {
  options = _.merge(defaultOptions, options);

  // STEP-01 serve prerendered html
  app.use((req, res, next) => {
    if (req.url === '/') return next();
    if (!options.isRoutingUrl(req.url, req)) return next();
    const store = null; // TODO
    const App = null; // TODO
    if (!store || !App) return next();
    const context = {};
    const html = renderToString(
      h(Provider, { store },
        h(StaticRouter, { location: req.url, context },
          h(App))));
    if (context.url) {
      res.redirect(302, context.url);
    } else {
      res.send(html);
    }
    return null; // just to make eslint happy
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

    app.get('/', (req, res, next) => {
      const filename = path.join(compiler.outputPath, options.fileIndexHtml);
      compiler.outputFileSystem.readFile(filename, (err, result) => {
        if (err) return next(err);
        res.set('content-type', 'text/html');
        res.send(result);
        return null; // just to make eslint happy
      });
    });
    app.use(require('webpack-hot-middleware')(compiler, options.webpackHotOptions));
  }

  return (req, res, next) => {
    app.handle(0, req, res, next);
  };
}

module.exports = middleware;
