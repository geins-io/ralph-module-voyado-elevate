export default {
  name: 'VoyadoProductCard',
  mixins: [],
  props: {},
  data: () => ({
    products: []
  }),
  computed: {},
  watch: {
    productData: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (Object.keys(newVal).length <= 0 || !newVal?.products) {
          return;
        }
        this.products = newVal.products;
        this.setProduct(this.products[0]);
      }
    }
  },
  mounted() {},
  methods: {}
};
