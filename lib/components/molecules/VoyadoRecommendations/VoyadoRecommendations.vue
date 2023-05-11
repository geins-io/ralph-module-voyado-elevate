<template>
  <div class="voyado-recommendations">
    <div
      v-for="list in recommendationLists"
      :key="list.id"
      class="voyado-recommendations__list"
    >
      <h3 class="voyado-recommendations__title">
        {{ getTitle(list.id) }}
      </h3>
      <CaProductListSlider
        class="voyado-recommendations__slider"
        :products="list.products"
        :page-size="limit"
        :dots="true"
        :arrow-icon-name="$config.productListWidgetArrowIconName"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
// Voyado recommendations
export default {
  name: 'VoyadoRecommendations',
  props: {
    // Widget configuration object
    configuration: {
      type: Object,
      default: () => ({})
    },
    // The product key
    productKey: {
      type: String,
      default: null
    },
    // How many random titles
    randomTitles: {
      type: Number,
      default: 0
    },
    limit: {
      type: Number,
      default: 8
    }
  },
  data: () => ({
    recommendationLists: [],
    isLoading: false
  }),
  computed: {
    id() {
      return this.configuration?.voyadoId?.split('|')[0].trim();
    },
    algorithm() {
      return this.configuration?.voyadoId?.split('|')[1].trim();
    },
    ...mapState(['voyado'])
  },
  mounted() {
    this.fetchRecommendations();
  },
  methods: {
    async fetchRecommendations() {
      try {
        this.isLoading = true;
        let data;

        if (this.productKey) {
          data = await this.voyado.api.query.productPage(
            {
              productKey: this.productKey,
              presentCustom: 'ralph_data|ralph_data_skus'
            },
            {
              productGroup: {
                include: true
              },
              recommendationLists: [
                {
                  id: 'ALTERNATIVES',
                  algorithm: 'ALTERNATIVES',
                  limit: 8
                },
                {
                  id: 'UPSELL',
                  algorithm: 'UPSELL',
                  limit: 8
                }
              ]
            }
          );

          this.$emit(
            'voyadoProductTicket',
            data.productGroup.products[0].ticket
          );
        } else {
          data = await this.voyado.api.query.landingPage(
            {
              pageReference: '/',
              presentCustom: 'ralph_data|ralph_data_skus'
            },
            {
              recommendationLists: [
                {
                  id: this.id,
                  algorithm: this.algorithm,
                  limit: this.limit
                }
              ]
            }
          );
        }

        this.recommendationLists = await Promise.all(
          data?.recommendationLists?.map(async list => {
            const products = list.productGroups;
            const transformedProducts = await this.$store.dispatch(
              'transformProducts',
              products
            );
            return {
              ...list,
              products: transformedProducts
            };
          })
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn(error);
      } finally {
        this.isLoading = false;
      }
    },
    getTitle(id) {
      const randomNr =
        this.randomTitles > 0
          ? '_' + (Math.floor(Math.random() * this.randomTitles) + 1)
          : '';
      const langKeyPart = this.productKey ? `${id}${randomNr}` : this.algorithm;
      return (
        this.configuration?.title ||
        this.$t(`VOYADO_RECOMMENDATIONS_TITLE_${langKeyPart}`)
      );
    }
  }
};
</script>
<style lang="scss">
@import 'molecules/voyado-recommendations';
</style>
