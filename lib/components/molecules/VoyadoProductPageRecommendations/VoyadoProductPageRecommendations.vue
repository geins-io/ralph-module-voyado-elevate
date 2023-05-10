<template>
  <div class="voyado-product-page-recommendations">
    <CaContainer>
      <div
        v-for="list in recommendationLists"
        :key="list.id"
        class="voyado-product-page-recommendations__list"
      >
        <h3 class="voyado-product-page-recommendations__title">
          {{ $t(`VOYADO_RECOMMENDATIONS_TITLE_${list.id}${getRandomTitle()}`) }}
        </h3>
        <CaProductListSlider
          class="voyado-product-page-recommendations__slider"
          :products="list.products"
          :page-size="$config.productListPageSize"
          :arrows="true"
          :dots="true"
          :arrow-icon-name="$config.productListWidgetArrowIconName"
        />
      </div>
    </CaContainer>
  </div>
</template>
<script>
import { mapState } from 'vuex';
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
    randomTitles: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    recommendationLists: [],
    isLoading: false
  }),
  computed: {
    ...mapState(['voyado'])
  },
  mounted() {
    this.fetchRecommendations();
  },
  methods: {
    async fetchRecommendations() {
      try {
        const data = await this.voyado.api.query.productPage(
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

        this.$emit('voyadoProductTicket', data.productGroup.products[0].ticket);

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
    getRandomTitle() {
      return this.randomTitles > 0
        ? '_' + (Math.floor(Math.random() * this.randomTitles) + 1)
        : '';
    }
  }
};
</script>
