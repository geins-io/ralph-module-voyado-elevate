<template>
  <div class="voyado-search-results">
    <CaSpinner
      v-if="isLoading"
      class="voyado-search-results__spinner"
      :class="{
        empty: !hasProducts
      }"
      :loading="isLoading"
    />
    <div
      v-if="hasProducts"
      class="voyado-search-results__results voyado-search-results__results--products"
    >
      <div class="voyado-search-results__top">
        <h2 class="voyado-search-results__title">
          {{ $t('VOYADO_SEARCH_RESULTS_TITLE') }}
        </h2>
        <button
          class="voyado-search-results__see-all-button"
          type="button"
          @click="visitSearchPage"
        >
          <CaIconAndText
            class="voyado-search-results__see-all-text"
            icon-name="arrow-right"
            icon-position="right"
          >
            {{ $t('VOYADO_SEARCH_RESULTS_SEE_ALL') }}
          </CaIconAndText>
        </button>
      </div>
      <VoyadoSearchProductResults :products="products" />
    </div>
    <div
      v-else-if="!hasProducts && !isLoading"
      class="voyado-search-results__results voyado-search-results__results--empty"
    >
      <p v-if="searchQuery.length === 0">
        {{ $t('VOYADO_SEARCH_RESULTS_EMPTY_QUERY') }}
      </p>
      <p v-else>
        {{ $t('VOYADO_SEARCH_RESULTS_NO_MATCH') }}
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VoyadoSearchReults',
  props: {
    products: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isFocus: {
      type: Boolean,
      default: false
    },
    totalResults: {
      type: Number,
      default: 0
    },
    searchQuery: {
      type: String,
      default: ''
    },
    hasProducts: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    visitSearchPage() {
      this.$emit('voyadoSearchOnRouteChange');
    }
  }
};
</script>
