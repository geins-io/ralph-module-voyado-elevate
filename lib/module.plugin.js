const moduleOptions = '<%= JSON.stringify(options) %>';
import { esales } from '@apptus/esales-api';

export default function(app, inject) {
  const options = JSON.parse(moduleOptions);
  inject(options.name, options);

  app.store.registerModule(options.name, {
    state: () => ({
      api: null
    }),
    mutations: {
      setApi(state, api) {
        state.api = api;
      }
    },
    actions: {
      initVoyado({ commit, rootState, rootGetters }) {
        const api = esales({
          clusterId: options.clusterId,
          market: rootState.channel.currentMarket,
          locale: rootState.channel.currentLocale,
          touchpoint: rootGetters.viewport === 'phone' ? 'mobile' : 'desktop'
        });
        commit('setApi', api);
      },
      transformProducts({ commit }, products) {
        const transformedData = products.map(product => {
          let prod = null;
          try {
            prod = JSON.parse(product.products[0].custom.ralph_data[0].label)
              .json;
            prod.skus = JSON.parse(
              product.products[0].custom.ralph_data_skus[0].label
            ).json;
            prod.voyadoData = product;
          } catch (error) {
            console.log('Could not parse product data', error);
          }
          return prod;
        });

        return transformedData.filter(product => product !== null);
      }
    }
  });

  // subscribe to store mutations
  app.store.subscribe((mutation, state) => {
    if (mutation.type === 'events/push') {
      const eventType = mutation.payload.type;
      if (eventType.includes('click')) {
        // console.log(eventType);
      }
    }
  });
}
