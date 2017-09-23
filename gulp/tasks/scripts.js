const rollup = require('rollup').rollup;
const configs = require('../config').configs;

module.exports = function scripts() {
  const bundles = configs.map(config => rollup(config).then((bundle) => {
    config.cache = bundle;
    return bundle.write(config.output);
  }));

  return Promise.all(bundles);
};
