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
        >
          <div class="voyado-search-product-results__image">
            <CaImage
              v-if="product.imageInfo.thumbnail"
              class="voyado-search-product-results__image"
              type="product"
              :ratio="$config.productImageRatio"
              :src="product.imageInfo.thumbnail"
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
          </div>
          <div class="voyado-search-product-results__info">
            <div class="voyado-search-product-results__item-name">
              {{ product.title }}
            </div>
            <div class="voyado-search-product-results__price">
              <span class="voyado-search-product-results____selling">
                {{ product.sellingPrice.min }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'VoyadoSearchProductResults',
  props: {
    products: {
      type: Array,
      required: true,
      default: () => []
    }
  }
};
</script>
