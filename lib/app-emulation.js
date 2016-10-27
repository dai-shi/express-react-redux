// emulating express middleware
const app = {
  stack: [],
  use: func => app.stack.push(func),
  get: (url, func) => app.stack.push((req, res, next) => {
    if (req.method === 'get' && req.url === url) {
      func(req, res, next);
    } else {
      next();
    }
  }),
  handle: (index, req, res, next) => {
    if (app.stack[index]) {
      app.stack[index](req, res, err =>
        (err ? next(err) : app.handle(index + 1, req, res, next)));
    } else {
      next();
    }
  },
};

module.exports = app;
