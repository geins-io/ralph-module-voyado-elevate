export default {
  name: 'VoyadoProductPage',
  mixins: [],
  props: {},
  data: () => ({
    voyadoData: '',
    ticket: ''
  }),
  computed: {
    voyadoProduct() {
      return {
        voyadoData: this.voyadoData,
        ticket: this.ticket,
        ...this.product
      };
    }
  },
  watch: {},
  mounted() {},
  methods: {
    setVoyadoData(data) {
      this.voyadoData = data;
      this.ticket = data.products[0].ticket;

      this.$store.dispatch('events/push', {
        type: 'product-detail:ticket',
        data: { ticket: this.ticket }
      });
    }
  }
};
