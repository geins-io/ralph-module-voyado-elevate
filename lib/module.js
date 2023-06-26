const path = require('path');

const {
  default: VoyadoProductPage
} = require('./components/mixins/VoyadoProductPage');
const {
  default: VoyadoProductCard
} = require('./components/mixins/VoyadoProductCard');
const {
  default: VoyadoListPage
} = require('./components/mixins/VoyadoListPage');

const moduleName = 'voyado';

const defaults = {
  name: moduleName,
  debug: false,
  enabled: true,
  clusterId: '',
  pdpRecommendationLimit: 8
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
  this.nuxt.hook('vue:extend', Component => {
    Component.mixin(VoyadoProductCard);
  });
  this.nuxt.hook('vue:extend', Component => {
    Component.mixin(VoyadoListPage);
  });

  return true;
};

module.exports.meta = require('../package.json');
module.exports.VoyadoProductPage = VoyadoProductPage;
module.exports.VoyadoProductCard = VoyadoProductCard;
module.exports.VoyadoListPage = VoyadoListPage;
