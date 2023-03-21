import { log } from './module.utils'
const moduleOptions = '<%= JSON.stringify(options) %>'

export default function(app, inject) {
  const options = JSON.parse(moduleOptions)
  inject(options.name, msg => log(`Hello ${msg}!`))

  // subscribe to store mutations
  app.store.subscribe((mutation, state) => {
    if (mutation.type === 'cart/setAdded') {
      const cart = state.cart
      log('Current cart', cart)
    }
  })
}
