export default {
  name: 'VoyadoProductPage',
  mixins: [],
  props: {},
  data: () => ({
    ticket: ''
  }),
  computed: {
    favProduct() {
      return {
        ...this.product,
        ...this.ticket
      };
    }
  },
  watch: {},
  mounted() {},
  methods: {
    setTicket(ticket) {
      this.ticket = ticket;
    }
  },
  head() {}
};
