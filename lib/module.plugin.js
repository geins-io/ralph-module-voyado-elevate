import { log } from './module.utils';
const moduleOptions = '<%= JSON.stringify(options) %>';

export default function(app, inject) {
  const options = JSON.parse(moduleOptions);
  inject(options.name, options);

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
