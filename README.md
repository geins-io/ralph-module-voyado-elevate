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

Once installed, you can add the module to your Nuxt2 app by updating the modules array in the nuxt.config.js file. You can then configure the module by adding options to the `ralph-module-voyado-elevate` object.:
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
        clusterId: 'yourIntegrationKey'
      }
    ]
  ]
}
```

## Usage

After installing the module, you can use its components in your Nuxt2 app by importing them in your .vue files:

```vue
<template>
  <ralph-voyado-elevate-component />
</template>

<script>
import { RalphVoyadoElevateComponent } from 'ralph-module-voyado-elevate'

export default {
  components: {
    RalphVoyadoElevateComponent
  }
}
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