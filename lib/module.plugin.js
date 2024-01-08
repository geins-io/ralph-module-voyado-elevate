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
          let products = [];

          products = product.products.map(prod => {
            try {
              const ralph_data = JSON.parse(prod.custom.ralph_data[0].label)
                .json;
              const ralph_skus = JSON.parse(
                prod.custom.ralph_data_skus[0].label
              ).json;
              const ralph_variant_dimensions = JSON.parse(
                prod.custom.ralph_data_variant_dimensions[0].label
              ).json;
              const ralph_data_product_images = prod.custom
                .ralph_data_product_images
                ? JSON.parse(prod.custom.ralph_data_product_images[0].label)
                    .json
                : ralph_data.productImages;

              return {
                ...prod,
                skus: ralph_skus,
                alias: ralph_data.alias,
                brand: ralph_data.brand,
                unitPrice: ralph_data.unitPrice,
                discountType: ralph_data.discountType,
                productId: ralph_data.productId,
                parameterGroups: ralph_data.parameterGroups,
                discountCampaigns: ralph_data.discountCampaigns,
                variantDimensions: ralph_variant_dimensions,
                firstAvailableOn: ralph_data.firstAvailableOn,
                productImages: ralph_data_product_images,
                images: ralph_data.images,
                totalStock: ralph_data.totalStock,
                canonicalUrl: ralph_data.canonicalUrl,
                name: ralph_data.name
              };
            } catch (error) {
              console.log(
                `Could not parse product data for: ${prod.title}`,
                error
              );
              return null;
            }
          });

          return {
            ...product,
            products: products.filter(prod => prod !== null)
          };
        });

        return transformedData.filter(product => product.products.length > 0);
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
        const productKey = eventData.product?.key;

        if (eventType.includes('add') && productKey) {
          api.notify.addFavorite(productKey);
        }

        if (eventType.includes('remove') && productKey) {
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
