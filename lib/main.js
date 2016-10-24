const _ = require('lodash');

const defaultOptions = {
};

function middleware(options) {
  const opts = _.merge(defaultOptions, options || {});
  return (req, res, next) => {
    opts.dummy(); // TODO
    next();
  };
}

module.exports = middleware;
