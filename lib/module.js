const path = require('path');

const {
  default: VoyadoProductPage
} = require('./components/mixins/VoyadoProductPage');

const moduleName = 'voyado';

const defaults = {
  name: moduleName,
  debug: true
};

module.exports = function(moduleOptions) {
  const options = {
    ...defaults,
    ...this.options[moduleName],
    ...moduleOptions
  };

  if (!options.enabled) {
    return false;
  }

  this.addTemplate({
    src: path.resolve(__dirname, 'module.utils.js'),
    fileName: `${moduleName}.utils.js`,
    options
  });

  this.addPlugin({
    src: path.resolve(__dirname, 'module.plugin.js'),
    fileName: `${moduleName}.plugin.js`,
    options
  });

  this.nuxt.hook('components:dirs', dirs => {
    dirs.push({
      path: path.resolve(__dirname, 'components'),
      prefix: 'voyado',
      extensions: ['vue']
    });
  });

  this.nuxt.hook('vue:extend', Component => {
    Component.mixin(VoyadoProductPage);
  });

  return true;
};

module.exports.meta = require('../package.json');
module.exports.VoyadoProductPage = VoyadoProductPage;
