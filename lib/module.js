const path = require('path')
const { requireNuxtVersion } = require('./compatibility')
import { createMiddleware } from './module.middleware'
import plugin from './module.plugin';
import utils from './module.utils';

const moduleName = 'voyadoElevateModule';

const defaults = {
  name: moduleName,
  debug: true,
  // your default options goes here
}

module.exports = async function(moduleOptions) {
  requireNuxtVersion(this.nuxt, '2.0.0');
  const { nuxt } = this;
  const consola = require('consola');

  const options = {
    ...defaults,
    ...this.options[moduleName],
    ...moduleOptions,
  }

  if(!options.enabled){
    return false;
  }

  this.addTemplate({
    src: path.resolve(__dirname, 'module.utils.js'),
    fileName: 'module.utils.js',
    options: options
  });

  this.addPlugin({
    src: path.resolve(__dirname, 'module.plugin.js'),
    fileName: 'plugin.js',
    options: options
  });
  // log with consola to see the message in the


  consola.info('Voyado Elevate Module is enabled');
  this.nuxt.hook('components:dirs', (dirs) => {
    dirs.push({
      path: path.resolve(__dirname, 'components'),
      prefix: 'voyado',
      extensions: ['vue']
    });
  });

  /*
  this.nuxt.hook('components:dirs', (dirs) => {
    dirs.push({
      path: path.resolve(__dirname, 'components'),
      prefix: 'voyado',
      extensions: ['js']
    });
  });
*/

  return true
}
module.exports.meta = require('../package.json');
