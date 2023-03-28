<template>
  <div class="voyado-search-results-list">
    <ul
      class="voyado-search-results-list__list voyado-search-results-list__list--primary"
    >
      <li
        v-for="product in products"
        :key="product.key"
        class="voyado-search-results-list__item voyado-search-results-list__item--product"
      >
        <div class="voyado-search-results-list__item-image">
          <CaImage
            v-if="product.imageInfo.thumbnail"
            class="voyado-search-results-list__item-image"
            type="product"
            :ratio="$config.productImageRatio"
            :src="product.imageInfo.thumbnail"
            :alt="product.title"
            sizes="40px"
          />
          <CaImage
            v-else
            class="voyado-search-results-list__item-image"
            :ratio="$config.productImageRatio"
            :src="require('~/assets/placeholders/product-image-square.png')"
            alt="placeholder"
          />
        </div>
        <div class="voyado-search-results-list__item-info">
          <div class="voyado-search-results-list__item-name">
            {{ product.title }}
          </div>
          <div class="voyado-search-results-list__price">
            <span class="voyado-search-results-list____selling">
              {{ product.sellingPrice.min }}
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'VoyadoSearchReultsList',
  props: {
    products: {
      type: Array,
      required: true,
      default: () => []
    }
  }
};
</script>
