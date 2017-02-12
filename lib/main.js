const path = require('path');
const _ = require('lodash');
const serveStatic = require('serve-static');
const app = require('./app-emulation.js');
const { createElement: h } = require('react');
const { renderToString } = require('react-dom/server');
const { StaticRouter } = require('react-router-dom');
const { createStore } = require('redux');
const { Provider } = require('react-redux');
const requireFromString = require('require-from-string');


const defaultOptions = {
  isProductionMode: () => process.env.NODE_ENV === 'production',
  isRoutingUrl: (url, req) => (/\.html?$/.test(url) || !/\.\w+$/.test(url)) && req.header('accept') !== 'text/event-stream',
  dirSourceClient: './src/client',
  dirBuildClient: './build/client',
  fileIndexHtml: 'index.html',
  fileIndexJs: 'index.js',
  dirSourceServer: './src/server',
  dirBuildServer: './build/server',
  optsServeClient: { redirect: false },
  webpackDevConfig: require('./webpack-dev-config.js'),
  webpackDevOptions: { noInfo: true, publicPath: '/' },
  webpackDevBuildCallback: () => console.log('webpack dev build done.'),
};


function middleware(options = {}) {
  options = _.merge(defaultOptions, options);

  // STEP-01 check production mode
  const productionMode = options.isProductionMode();
  let compiler; // webpack compiler only used if not production mode

  // STEP-02 serve assets and index.html
  if (productionMode) {
    app.use(serveStatic(options.dirBuildClient, options.optsServeClient));
  } else {
    compiler = require('webpack')(options.webpackDevConfig);
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

  // STEP-03 serve prerendered html
  const getClientModule = (file) => {
    /* eslint-disable import/no-dynamic-require */
    if (productionMode) {
      return require(path.resolve(options.dirBuildServer, file));
    }
    const content = compiler.outputFileSystem.readFileSync(path.join(compiler.outputPath, file), 'utf8');
    return requireFromString(content); // TODO we should cache it
    /* eslint-enable import/no-dynamic-require */
  };
  app.use((req, res, next) => {
    if (req.url === '/') return next();
    if (!options.isRoutingUrl(req.url, req)) return next();
    const reducer = getClientModule('reducer.js'); // XXX hard coded
    const App = getClientModule('App.js'); // XXX hard coded
    if (!reducer || !App) return next();
    const store = createStore(reducer);
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

  return (req, res, next) => {
    app.handle(0, req, res, next);
  };
}

module.exports = middleware;
