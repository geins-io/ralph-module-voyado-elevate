<template>
  <div class="voyado-product-page-recommendations">
    <div class="voyado-product-page-recommendations__header">
      <h2 class="voyado-product-page-recommendations__title">
        {{ $t('VOYADO_PRODUCT_PAGE_RECOMMENDATIONS_TITLE') }}
      </h2>
    </div>
    <div class="voyado-product-page-recommendations__content">
      <div class="voyado-product-page-recommendations__list"></div>
    </div>
  </div>
</template>
<script>
import { esales } from '@apptus/esales-api';
// @group Molecules
// The product page recommendations<br><br>
// **SASS-path:** _./styles/components/molecules/voyado-search.scss_
export default {
  name: 'VoyadoProductPageRecommendations',
  props: {
    productKey: {
      type: [String, Number],
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
    recommendationLists: [],
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
    this.fetchRecommendations();
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
    async fetchRecommendations() {
      try {
        const data = await this.api().query.productPage({
          productKey: this.productKey,
          limit: 10
        });

        this.recommendationLists = data;
        console.log(
          '🚀 ~ file: VoyadoProductPageRecommendations.vue:85 ~ fetchRecommendations ~ this.recommendationLists:',
          this.recommendationLists
        );
      } catch (error) {
        this.$nuxt.error({ statusCode: error.statusCode, message: error });
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
