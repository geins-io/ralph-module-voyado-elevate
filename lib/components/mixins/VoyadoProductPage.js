export default {
  name: 'VoyadoProductPage',
  mixins: [],
  props: {},
  data: () => ({
    voyadoData: '',
    ticket: '',
    key: ''
  }),
  computed: {
    voyadoProduct() {
      return {
        voyadoData: this.voyadoData,
        ticket: this.ticket,
        key: this.key,
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
      this.key = data.products[0].key;

      this.$store.dispatch('events/push', {
        type: 'product-detail:ticket',
        data: { ticket: this.ticket }
      });
    }
  }
};
