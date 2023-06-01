const moduleOptions = '<%= JSON.stringify(options) %>';
import { esales } from '@apptus/esales-api';

export default function(app, inject) {
  const options = JSON.parse(moduleOptions);
  inject(options.name, options);

  app.store.registerModule(options.name, {
    state: () => ({
      api: null,
      searchOrigin: 'ORGANIC',
      addedToCart: []
    }),
    mutations: {
      setApi(state, api) {
        state.api = api;
      },
      setSearchOrigin(state, origin = 'ORGANIC') {
        state.searchOrigin = origin;
      },
      voyadoAdd(state, product) {
        state.addedToCart.push(product);
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

        const merchantData = {
          voyadoElevateData: {
            customerKey: api.session.customerKey,
            sessionKey: api.session.sessionKey,
            market: rootState.channel.currentMarket
          }
        };
        commit('checkout/setMerchantData', JSON.stringify(merchantData));
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
            prod.ticket = product.products[0].ticket;
          } catch (error) {
            console.log('Could not parse product data', error);
          }
          return prod;
        });

        return transformedData.filter(product => product !== null);
      }
    }
  });

  // Listen to the events in ralph and notify Voyado
  app.store.subscribe((mutation, state) => {
    if (mutation.type === 'events/push') {
      const eventType = mutation.payload.type;
      const eventData = mutation.payload.data;
      const api = state.voyado.api;

      if (eventType.includes('favorite')) {
        const productKey =
          eventData.product?.articleNumber ||
          eventData.product?.voyadoData?.products?.[0].key;

        if (!productKey) {
          return;
        }

        if (eventType.includes('add')) {
          api.notify.addFavorite(productKey);
        }
        if (eventType.includes('remove')) {
          api.notify.removeFavorite(productKey);
        }
      }
      if (eventType === 'cart:add') {
        const product = eventData.product;
        const ticket =
          product.ticket ||
          app.store.state.voyado.addedToCart.find(
            prod => prod.productId === product.productId
          )?.ticket;

        if (ticket) {
          app.store.commit('voyadoAdd', product);
          api.notify.addToCart(ticket);
        }
      }
      if (eventType === 'search:click') {
        if (eventData.type === 'product') {
          const ticket = eventData.data.ticket;
          api.notify.click(ticket);
        }
      }
      if (eventType === 'product:click') {
        const ticket = eventData.product.ticket;
        if (ticket) {
          api.notify.click(ticket);
        } else {
          app.store.dispatch('events/push', {
            type: 'product:click-no-ticket'
          });
        }
      }
      if (eventType === 'product-detail:ticket') {
        const currentEvents = JSON.parse(
          JSON.stringify(app.store.state.events.events)
        );
        const lastEvent = currentEvents[currentEvents.length - 2];
        if (lastEvent.type === 'product:click-no-ticket') {
          api.notify.click(eventData.ticket);
        }
      }
    }
  });
}
