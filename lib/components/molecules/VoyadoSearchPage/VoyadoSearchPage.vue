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
          limit: 100
        });

        this.list = data;
        console.log(
          '🚀 ~ file: VoyadoSearchPage.vue:76 ~ fetchSearchPage ~ this.list:',
          this.list
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
