const moduleOptions = '<%= JSON.stringify(options) %>';
import { esales } from '@apptus/esales-api';

export default function(app, inject) {
  const options = JSON.parse(moduleOptions);
  inject(options.name, options);

  // app.store.registerModule('voyado', {
  //   state: {
  //     api: null
  //   },
  //   mutations: {
  //     setApi(state, api) {
  //       state.api = api;
  //     }
  //   },
  //   actions: {
  //     init({ commit, state, rootGetters }) {
  //       const api = () => {
  //         return esales({
  //           clusterId: options.clusterId,
  //           market: state.channel.currentMarket,
  //           locale: app.$i18n.localeProperties.iso,
  //           touchpoint: rootGetters.viewport === 'phone' ? 'mobile' : 'desktop'
  //         });
  //       };
  //       commit('setApi', api);
  //     }
  //   }
  // });

  // setTimeout(() => {
  //   app.store.dispatch('voyado/init');
  // }, 1000);

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
