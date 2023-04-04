# Ralph Module for Voyado Elevate

> Component library for Voyado Elevate integrations with Ralph Storefront

## Installation

To use the Ralph Module for Voyado Elevate in your Nuxt2 app, you can install it from npm using the following command:

```bash
# Install the package using npm:
npm install ralph-module-voyado-elevate
```

or

```bash
# Install the package using yarn:
yarn add ralph-module-voyado-elevate
```

Once installed, you can add the module to your Nuxt2 app by updating the modules array in the nuxt.config.js file. You can then configure the module by adding options to the `ralph-module-voyado-elevate` object:
```javascript
// nuxt.config.js

module.exports = {
  modules: [
    ['ralph-module-voyado-elevate',
      // Configuration options for the Ralph Module for Voyado Elevate
      {
        // Set to true to enable the module
        enabled: true,

        // Your Voyado Elevate cluster ID
        clusterId: 'yourClusterId'
      }
    ]
  ]
}
```

After installing the module, make sure to add the `@apptus/esales-api` package to the transpile array so that it can be transpiled correctly. And add the configuration to support CommonJS files for `@apptus/esales-api` by pushing a new rule to the `config.module.rules` array in the `build.extend` method. Here's an example configuration:
```javascript
// nuxt.config.js

export default {
  // ...

  transpile: [
    '@apptus/esales-api'
  ],

  build: {
    // You can extend webpack config here
    extend (config, { isDev }) {
      // Support CommonJS files for @apptus/esales-api
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      });
    }
  }
}
```

## Usage

After installing the module, you can use its components in your Nuxt2 app by importing them in your .vue files:

```vue
<template>
  <div>
    <VoyadoSearch
      :cluster-id="clusterId"
      :market="market"
      :locale-iso="localeIso"
      :is-visible="isVisible"
      :product-results-limit="productResultsLimit"
      @voyadoSearchOnClose="onSearchClose"
      @voyadoSearchOnRouteChange="onSearchRouteChange"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    clusterId: 'your_cluster_id',
    market: 'your_market',
    localeIso: 'your_locale_iso',
    isVisible: true,
    productResultsLimit: 10
  }),
  methods: {
    onSearchClose() {
      console.log('Search closed');
    },
    onSearchRouteChange() {
      console.log('Search route changed');
    }
  }
};
</script>
```

## Development

To contribute to this module, clone this repository and run the following commands:

```bash
# Install dependencies
npm install

# Run development server with test fixture
npm run dev

# Run unit tests
npm run test:unit

# Run system tests
npm run test:system

# Run test coverage
npm run test:coverage

# Format code
npm run format

# Lint code
npm run lint
```

## License
MIT

## Note
This module requires Nuxt2 to work properly.