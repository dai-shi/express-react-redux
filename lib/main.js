const _ = require('lodash');

const defaultOptions = {
  isProductionMode: () => process.env.NODE_ENV === 'production',
  isMainUrl: url => url === '/' || /\.html?$/.test(url) || !/\.\w+$/.test(url),
};

function middleware(options) {
  const opts = _.merge(defaultOptions, options || {});
  const serveMainHtml = (req, res) => {
    if (opts.isProductionMode()) {
      // TODO
    } else {
      // TODO
    }
  };
  return (req, res, next) => {
    if (opts.isMainUrl(req.url, req)) {
      serveMainHtml(req, res);
      next();
    }
    next();
  };
}

module.exports = middleware;
