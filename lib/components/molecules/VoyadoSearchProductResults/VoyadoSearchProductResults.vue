<template>
  <div class="voyado-search-product-results">
    <h3 class="voyado-search-product-results__title">
      {{ $tc('VOYADO_SEARCH_PRODUCT_RESULTS_TITLE', 2) }}
    </h3>
    <ul
      class="voyado-search-product-results__list voyado-search-product-results__list--primary"
    >
      <li
        v-for="(product, index) in products"
        :key="index"
        class="voyado-search-product-results__item voyado-search-product-results__item--product"
      >
        <NuxtLink
          class="voyado-search-product-results__link voyado-search-product-results__link--product"
          :to="product.link"
          :title="product.title"
          @click.native="clickHandler(product)"
        >
          <CaImage
            v-if="product.imageInfo.thumbnail"
            class="voyado-search-product-results__image"
            type="product"
            :ratio="$config.productImageRatio"
            :filename="getImageFilename(product.imageInfo.thumbnail)"
            :alt="product.title"
            sizes="40px"
          />
          <CaImage
            v-else
            class="voyado-search-product-results__image"
            :ratio="$config.productImageRatio"
            :src="require('~/assets/placeholders/product-image-square.png')"
            alt="placeholder"
          />
          <div class="voyado-search-product-results__info">
            <div
              class="ca-price"
              :class="{
                'ca-price--product-sale': product.discountType === 'SALE_PRICE',
                'ca-price--campaign': product.discountType === 'PRICE_CAMPAIGN'
              }"
            >
              <span
                v-if="product.discountType !== 'NONE'"
                class="ca-price__regular"
              >
                {{ formatCurrency(regularPrice(product)) }}
              </span>

              <span class="ca-price__selling">
                {{ formatCurrency(sellingPrice(product)) }}
              </span>
            </div>
            <CaBrandAndName
              :brand="product.brand"
              :name="product.title"
              name-tag="h3"
            />
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
<script>
import MixNumberFormat from 'MixNumberFormat';
export default {
  name: 'VoyadoSearchProductResults',
  mixins: [MixNumberFormat],
  props: {
    products: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  methods: {
    getImageFilename(imageUrl) {
      const filename = imageUrl.split('/').pop();
      return filename;
    },
    clickHandler(product) {
      this.$emit('voyadoSearchOnProductClick');
      this.$store.dispatch('events/push', {
        type: 'search:click',
        data: { type: 'product', data: product }
      });
    },
    regularPrice(product) {
      return (
        product?.lowestPrice?.comparisonPriceIncVat || product?.listPrice.min
      );
    },
    sellingPrice(product) {
      return (
        product?.lowestPrice?.sellingPriceIncVat || product?.sellingPrice.min
      );
    }
  }
};
</script>
