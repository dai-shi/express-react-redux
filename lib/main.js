const fs = require('fs');
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
const serialize = require('serialize-javascript');


const defaultOptions = {
  isProductionMode: () => process.env.NODE_ENV === 'production',
  isRoutingUrl: (url, req) => (/\.html?$/.test(url) || !/\.\w+$/.test(url)) && req.header('accept') !== 'text/event-stream',
  dirSourceClient: './src/client',
  dirBuildClient: './build/client',
  fileIndexHtml: 'index.html',
  fileIndexJs: 'index.js',
  fileAppJs: 'App.js',
  fileReducerJs: 'reducer.js',
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
  const getCompiler = filename => (
    compiler.compilers &&
    compiler.compilers.find(x => x.options.output.filename.endsWith(filename))
  ) || compiler;

  // STEP-02 serve assets and index.html
  if (productionMode) {
    app.use(serveStatic(options.dirBuildClient, options.optsServeClient));
  } else {
    compiler = require('webpack')(options.webpackDevConfig);
    compiler.plugin('done', options.webpackDevBuildCallback);
    app.use(require('webpack-dev-middleware')(compiler, options.webpackDevOptions));

    app.get('/', (req, res) => {
      const c = getCompiler(options.fileIndexJs);
      const html = c.outputFileSystem.readFileSync(path.join(c.outputPath, options.fileIndexHtml), 'utf8');
      res.set('content-type', 'text/html');
      res.send(html);
    });
    app.use(require('webpack-hot-middleware')(compiler, options.webpackHotOptions));
  }

  // STEP-03 serve prerendered html
  const getClientModule = (file) => {
    /* eslint-disable import/no-dynamic-require */
    let module;
    if (productionMode) {
      module = require(path.resolve(options.dirBuildClient, file));
    } else {
      const c = getCompiler(file);
      const filename = path.join(c.outputPath, file);
      const content = c.outputFileSystem.readFileSync(filename, 'utf8');
      module = requireFromString(content, filename);
    }
    if (module.default) module = module.default;
    return module;

    /* eslint-enable import/no-dynamic-require */
  };
  let indexHtml;
  const getIndexHtml = () => {
    if (productionMode) {
      if (!indexHtml) {
        indexHtml = fs.readFileSync(path.resolve(options.dirBuildClient, options.fileIndexHtml), 'utf8');
      }
      return indexHtml;
    }
    // not production mode
    if (!indexHtml) {
      const c = getCompiler(options.fileIndexJs);
      indexHtml = c.outputFileSystem.readFileSync(path.join(c.outputPath, options.fileIndexHtml), 'utf8');
    }
    return indexHtml;
  };
  app.use((req, res, next) => {
    if (req.url === '/') return next();
    if (!options.isRoutingUrl(req.url, req)) return next();
    const reducer = getClientModule(options.fileReducerJs);
    const App = getClientModule(options.fileAppJs);
    if (!reducer || !App) return next();
    const store = createStore(reducer);
    const context = {};
    const appHtml = renderToString(
      h(Provider, { store },
        h(StaticRouter, { location: req.url, context },
          h(App))));
    if (context.url) {
      res.redirect(302, context.url);
    } else {
      let html = getIndexHtml();
      const appDiv = '<div id="app">';
      html = html.replace(appDiv, appDiv + appHtml);
      const preloadedState = `<script>window.__PRELOADED_STATE__=${serialize(store.getState())}</script>`;
      const endBody = '</body>';
      html = html.replace(endBody, preloadedState + endBody);
      res.set('content-type', 'text/html');
      res.send(html);
    }
    return null; // just to make eslint happy
  });

  return (req, res, next) => {
    app.handle(0, req, res, next);
  };
}

module.exports = middleware;
