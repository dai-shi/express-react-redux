/* eslint-env jest */

const main = require('../lib/main.js');

describe('middleware', () => {
  it('call it without option', () => {
    main();
  });
});
