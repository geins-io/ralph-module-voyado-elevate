export default {
  name: 'VoyadoProps',
  props: {
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
  }
};
