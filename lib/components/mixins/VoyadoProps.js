export default {
  name: 'VoyadoProps',
  props: {
    clusterId: {
      type: String,
      default() {
        return this.$voyado?.clusterId;
      }
    },
    market: {
      type: String,
      default() {
        return this.$store?.state?.channel?.currentMarket?.toUpperCase();
      }
    },
    localeIso: {
      type: String,
      default() {
        return this.$i18n?.localeProperties?.iso;
      }
    }
  }
};
