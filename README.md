[![NPM Package][npm]][npm-url]
[![NPM Downloads][npm-downloads-per-month]][npm-trends]

# Ralph Module for Voyado Elevate

> Component library for Voyado Elevate integrations with Ralph Storefront

We use Voyado's helper library [@apptus/esales-api](https://www.npmjs.com/package/@apptus/esales-api) for API requests.

> A helper library for making requests to the eSales 4 Storefront API v3. It includes type definitions for all HTTPS responses and the library API.

## Requirements

This package require Nuxt2 to be installed in your project. Also it requires @ralph/ralph-ui 20.0.0 or higher.

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
      // Configuration defaults for the module
      {
        // Set to true to enable debug mode
        debug: false,
        // Set to false to disable the module
        enabled: true,
        // Your Voyado Elevate cluster ID, this is required
        clusterId: '',
        // Limit of products to fetch for the product page recommendations
        pdpRecommendationLimit: 8
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

## Components

After installing the module, you can use all its components in your Nuxt2 app straight away.

# VoyadoSearch

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

**Props**

| Name      | Type    | Default | Description                                                                      |
| --------- | ------- | ------- | -------------------------------------------------------------------------------- |
| isVisible | Boolean | false   | Sets the voyado-search--visible class. Can be used to toggle search from outside |

# VoyadoRecommendations

```vue
// pages/product/_alias.vue
<template>
  <div>
    <VoyadoRecommendations
      :product-key="product.articleNumber"
      :random-titles="3"
      @voyadoProductData="setVoyadoData"
    />
  </div>
</template>

<script>
import { VoyadoProductPage } from '@geins/ralph-module-voyado-elevate';
export default {
  mixins: [VoyadoProductPage]
};
</script>
```

**Props**

| Name          | Type   | Default | Description                                                             |
| ------------- | ------ | ------- | ----------------------------------------------------------------------- |
| configuration | Object | {}      | If used as widget, the widget configuration object                      |
| productKey    | String | null    | If used on product page, the productKey matching your id in Voyado feed |
| randomTitles  | Number | 0       | If used on product page, the number of random titles to show            |
| limit         | Number | 8       | Number of products to fetch                                             |
| productRules  | String | ''      | productRules to send to Voyado for product page recommendations         |

# VoyadoFilterPanel

This must be used in the same list component file where the VoyadoListPage mixin is used.

```vue
// components/organisms/CaListPageVoyado/CaListPageVoyado.vue
<template>
  <VoyadoFilterPanel
    :external-sort-options="sortOptions"
    :current-sort="sort"
    :facets="facets"
    @reset="resetHandler"
    @sortchange="sortChangeHandler"
    @selectionchange="selectionChangeHandler"
  />
</template>
<script>
import { VoyadoListPage } from '@geins/ralph-module-voyado-elevate';
export default {
  name: 'CaListPageVoyado',
  mixins: [VoyadoListPage]
};
</script>
```

**Props**

| Name                | Type    | Default    | Description                           |
| ------------------- | ------- | ---------- | ------------------------------------- |
| externalSortOptions | Array   | `required` | The sort options from the Voyado api  |
| currentSort         | String  | `required` | Current sort                          |
| facets              | Array   | `required` | The facets from the Voyado api        |
| showSortAtTop       | Boolean | false      | Set to true to show sort above facets |

## Mixins

There are three available mixins, VoyadoProductPage, VoyadoListPage and VoyadoProductCard. If you want to use Voyado for your list pages, you have to add the VoyadoListPage mixin to your list page component instead of the mixin from Ralph (MixListPage). Also, you will need to use the VoyadoProductCard mixin in the product card.

# VoyadoProductCard

Since Voyado is delivering it's product data in groups of variants for each product, this mixin comes prepared to set the displayed product to the forst product of the list.

```vue
// components/organisms/CaProductCard/CaProductCard.vue
<script>
import { VoyadoProductCard } from '@geins/ralph-module-voyado-elevate';
export default {
  mixins: [VoyadoProductCard]
};
</script>
```

# VoyadoProductPage

This mixin provides a computed property `voyadoProduct` that you can use to pass to the `CaToggleFavorite` component and to your `addToCart` function. It also provides a method `setVoyadoData` that you can use to set the product data from Voyado to the `voyadoProduct` property.

```vue
// pages/product/_alias.vue
<script>
import { VoyadoProductPage } from '@geins/ralph-module-voyado-elevate';
export default {
  mixins: [VoyadoProductPage]
};
</script>
```

# VoyadoListPage

Should be used instead of MixListPage in your list page component. Either make a new one for Voyado lists or use it in CaListPage. It has basically the same set of functionality. Use pageReferance instead of currentPath and use VoyadoFilterPanel instead of CaFilterPanel.

```vue
// components/organisms/CaListPageVoyado/CaListPageVoyado.vue
<script>
import { VoyadoListPage } from '@geins/ralph-module-voyado-elevate';
export default {
  mixins: [VoyadoListPage]
};
</script>
```

**Props**

| Name          | Type   | Default                      | Description                                                                 |
| ------------- | ------ | ---------------------------- | --------------------------------------------------------------------------- |
| type          | String | 'list'                       | 'list' or 'search'                                                          |
| query         | String | \$route.params.search        | Current search query                                                        |
| pageReference | String | decodeURI(\$route.path)      | The same as currentPath in Ralph, used to fetch landingPage from Voyado api |
| pageSize      | Number | \$config.productListPageSize | Number of products on each page                                             |
| listInfo      | Object | `required`                   | The listInfo object from Ralph api or static list info                      |
| defaultSort   | String | 'RELEVANCE'                  | The default sort                                                            |

## Notifications

For the Voyado notifications to work properly, you will need to use the `voyadoProduct` object in your product page, passing it to CaToggleFavorite and making sure that this is the product object that gets sent to your addToCart function. This object will be available through the `VoyadoProductPage` mixin.

## Translations

Available translations:

| Key                                     | Value                                                                                                                                              |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| VOYADO_SEARCH_FORM                      | `Search`                                                                                                                                           |
| VOYADO_SEARCH_FORM_PLACEHOLDER          | `Search`                                                                                                                                           |
| VOYADO_SEARCH_RESULTS_TITLE             | `Search results`                                                                                                                                   |
| VOYADO_SEARCH_RESULTS_NO_MATCH          | `Sorry, no matches found`                                                                                                                          |
| VOYADO_SEARCH_PRODUCT_RESULTS_TITLE     | `Product <PIPE> Products`                                                                                                                          |
| VOYADO_SEARCH_RESULTS_REMOVE_RECENT     | `Remove`                                                                                                                                           |
| VOYADO_SEARCH_RECENT_SEARCHES_TITLE     | `Recent searches`                                                                                                                                  |
| VOYADO_SEARCH_RESULTS_SUGGESTIONS_TITLE | `Popular searches`                                                                                                                                 |
| VOYADO_SEARCH_RESULTS_BUTTON            | `Show {hits} product | Show {hits} products`                                                                                                       |
| VOYADO_RECOMMENDATIONS_TITLE(.....)     | Will append \_\$list-id or $algorithm (and also \_\$random-nr if randomTitles are mre than 0). For example `VOYADO_RECOMMENDATIONS_TITLE_UPSELL_1` |

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

[npm]: https://img.shields.io/npm/v/@geins/ralph-module-voyado-elevate
[npm-url]: https://www.npmjs.com/package/@geins/ralph-module-voyado-elevate
[npm-downloads-per-month]: https://img.shields.io/npm/dm/@geins/ralph-module-voyado-elevate.svg
[npm-trends]: https://npmtrends.com/@geins/ralph-module-voyado-elevate
