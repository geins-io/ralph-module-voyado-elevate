export default {
  name: 'VoyadoProductPage',
  mixins: [],
  props: {},
  data: () => ({
    voyadoData: ''
  }),
  computed: {
    voyadoProduct() {
      return {
        voyadoData: this.voyadoData,
        ticket: this.voyadoData?.products[0].ticket,
        ...this.product
      };
    }
  },
  watch: {},
  mounted() {},
  methods: {
    setVoyadoData(data) {
      this.voyadoData = data;
      this.$store.dispatch('events/push', {
        type: 'product-detail:ticket',
        data: { ticket: this.voyadoProduct.ticket }
      });
    }
  }
};
