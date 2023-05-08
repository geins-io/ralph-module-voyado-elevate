<template>
  <div class="voyado-search-page">Sökresultat för "{{ query }}"</div>
</template>
<script>
import { esales } from '@apptus/esales-api';
// @group Molecules
// The product page recommendations<br><br>
// **SASS-path:** _./styles/components/molecules/voyado-search.scss_
export default {
  name: 'VoyadoProductPageRecommendations',
  props: {
    query: {
      type: String,
      required: true
    },
    currentClusterId: {
      type: String,
      default: ''
    },
    currentMarket: {
      type: String,
      default: ''
    },
    currentLocale: {
      type: String,
      default: ''
    },
    currentTouchpoint: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    list: [],
    isLoading: false
  }),
  computed: {
    clusterId() {
      return this.currentClusterId || this.$voyado?.clusterId || '';
    },
    market() {
      return (
        this.currentMarket || this.$store?.state?.channel?.currentMarket || ''
      );
    },
    locale() {
      return this.currentLocale || this.$i18n?.localeProperties?.iso || '';
    },
    touchpoint() {
      return (
        this.currentTouchpoint ||
        (this.$store?.getters?.viewport === 'phone' ? 'mobile' : 'desktop')
      );
    }
  },
  mounted() {
    this.fetchSearchPage();
  },
  methods: {
    api() {
      return esales({
        market: this.market,
        locale: this.locale,
        clusterId: this.clusterId,
        touchpoint: this.touchpoint
      });
    },
    async fetchSearchPage() {
      try {
        const data = await this.api().query.searchPage({
          q: this.query,
          limit: 100,
          presentCustom: 'ralph_data'
        });

        const products = data?.primaryList?.productGroups;
        this.list = this.transformProductsDataForRalph(products);
        console.log(
          '🚀 ~ file: VoyadoSearchPage.vue:78 ~ fetchSearchPage ~ this.list:',
          this.list
        );
      } catch (error) {
        this.$nuxt.error({ statusCode: error.statusCode, message: error });
      } finally {
        this.isLoading = false;
      }
    },
    transformProductsDataForRalph(products) {
      const transformedData = products.map(product => {
        let prod = null;
        try {
          // console.log(product.products[0].custom.ralph_data[0].label);
          prod = JSON.parse(product.products[0].custom.ralph_data[0].label);
        } catch (error) {
          //  console.log('Could not parse product data', error);
        }
        return prod;
      });

      return transformedData.filter(product => product !== null);
    }
  }
};
</script>
