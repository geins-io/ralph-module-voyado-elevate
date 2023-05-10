[![NPM Package][npm]][npm-url]
[![NPM Downloads][npm-downloads-per-month]][npm-trends]

# Ralph Module for Voyado Elevate

> Component library for Voyado Elevate integrations with Ralph Storefront

We use Voyado's helper library [@apptus/esales-api](https://www.npmjs.com/package/@apptus/esales-api) for API requests.

> A helper library for making requests to the eSales 4 Storefront API v3. It includes type definitions for all HTTPS responses and the library API.

## Installation

To use the Ralph Module for Voyado Elevate in your Nuxt2 app, you can install it from npm using the following command:

```bash
# Install the package using npm:
npm install @geins/ralph-module-voyado-elevate
```

Once installed, you can add the module to your Nuxt2 app by updating the modules array in the nuxt.config.js file. You can then configure the module by adding options to the `@geins/ralph-module-voyado-elevate` object:

```javascript
// nuxt.config.js

module.exports = {
  modules: [
    [
      '@geins/ralph-module-voyado-elevate',
      // Configuration options for the Ralph Module for Voyado Elevate
      {
        // Set to true to enable the module
        enabled: true,

        // Your Voyado Elevate cluster ID
        clusterId: 'yourClusterId'
      }
    ]
  ]
};
```

After installing the module, make sure to add the `@apptus/esales-api` package to the transpile array so that it can be transpiled correctly. And add the configuration to support CommonJS files for `@apptus/esales-api` by pushing a new rule to the `config.module.rules` array in the `build.extend` method. Here's an example configuration:

```javascript
// nuxt.config.js

export default {
  // ...

  transpile: ['@apptus/esales-api'],

  build: {
    // You can extend webpack config here
    extend(config, { isDev }) {
      // Support CommonJS files for @apptus/esales-api
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      });
    }
  }
};
```

## Usage

After installing the module, you can use its components in your Nuxt2 app by importing them in your .vue files:

```vue
<template>
  <div>
    <VoyadoSearch
      :is-visible="isVisible"
      @voyadoSearchOnClose="onSearchClose"
      @voyadoSearchOnRouteChange="onSearchRouteChange"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    isVisible: true
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

## Props

| Name              | Type    | Default                                                      | Description                                                                      |
| ----------------- | ------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| isVisible         | Boolean | false                                                        | Sets the voyado-search--visible class. Can be used to toggle search from outside |
| currentClusterId  | String  | this.\$voyado.clusterId                                      | The cluserId sent to Voyado                                                      |
| currentMarket     | String  | this.\$store.state.channel.currentMarket                     | The market sent to Voyado                                                        |
| currentLocale     | String  | this.\$i18n.localeProperties.iso                             | The locale sent to Voyado                                                        |
| currentTouchpoint | String  | 'mobile' or 'desktop' based on this.\$store.getters.viewport | The touchpoint sent to Voyado                                                    |

## Translations

Available translations:

| Key                                     | Value                                        |
| --------------------------------------- | -------------------------------------------- |
| VOYADO_SEARCH_FORM                      | `Search`                                     |
| VOYADO_SEARCH_FORM_PLACEHOLDER          | `Search`                                     |
| VOYADO_SEARCH_RESULTS_TITLE             | `Search results`                             |
| VOYADO_SEARCH_RESULTS_NO_MATCH          | `Sorry, no matches found`                    |
| VOYADO_SEARCH_PRODUCT_RESULTS_TITLE     | `Product <PIPE> Products`                    |
| VOYADO_SEARCH_RESULTS_REMOVE_RECENT     | `Remove`                                     |
| VOYADO_SEARCH_RECENT_SEARCHES_TITLE     | `Recent searches`                            |
| VOYADO_SEARCH_RESULTS_SUGGESTIONS_TITLE | `Popular searches`                           |
| VOYADO_SEARCH_RESULTS_BUTTON            | `Show {hits} product | Show {hits} products` |
| VOYADO_SEARCH_PAGE_TITLE                | `Search results for: {search}`               |

> NOTE: Replace `<PIPE>` with the "|" character

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

## Commits

We enforce [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) using [@commitlint/config-conventional](https://www.npmjs.com/package/@commitlint/config-conventional) combined with [@husky](https://www.npmjs.com/package/husky).

## License

MIT

## Note

This module requires Nuxt2 to work properly.

[npm]: https://img.shields.io/npm/v/@geins/ralph-module-voyado-elevate
[npm-url]: https://www.npmjs.com/package/@geins/ralph-module-voyado-elevate
[npm-downloads-per-month]: https://img.shields.io/npm/dm/@geins/ralph-module-voyado-elevate.svg
[npm-trends]: https://npmtrends.com/@geins/ralph-module-voyado-elevate
