const _ = require('lodash');
const serveStatic = require('serve-static');

const defaultOptions = {
  isProductionMode: () => process.env.NODE_ENV === 'production',
  isIndexHtmlUrl: url => url === '/' || /\.html?$/.test(url) || !/\.\w+$/.test(url),
  dirBuildClient: './build/client',
  optionsServeStatic: { redirect: false, fallthrough: false },
};


const getServeIndexHtml = (opts) => {
  const serveStaticMiddleware = serveStatic(opts.dirBuildClient, opts.optionsServeStatic);
  return (req, res) => {
    if (opts.isProductionMode(req)) {
      req.url = '/index.html'; // eslint-disable-line no-param-reassign
      serveStaticMiddleware(req, res, () => res.status(500).send('Error'));
    } else {
      // TODO
    }
  };
};

function middleware(options) {
  const opts = _.merge(defaultOptions, options || {});
  const serveIndexHtml = getServeIndexHtml(opts);
  return (req, res, next) => {
    if (opts.isIndexHtmlUrl(req.url, req)) {
      serveIndexHtml(req, res);
    }
    next();
  };
}

module.exports = middleware;
