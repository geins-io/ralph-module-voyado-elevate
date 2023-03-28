<template>
  <div class="voyado-search-results">
    <div class="voyado-search-results__top">
      <h2 class="voyado-search-results__title">
        {{ $t('SEARCH_RESULTS_TITLE') }}
      </h2>
      <button
        class="voyado-search-results__btn"
        type="button"
        @click="visitSearchPage"
      >
        <CaIconAndText
          class="voyado-search-results__see-all"
          icon-name="arrow-right"
          icon-position="right"
        >
          {{ $t('SEARCH_RESULTS_SEE_ALL') }}
        </CaIconAndText>
      </button>
    </div>
    <div class="voyado-search-results__results-wrap">
      <CaSpinner
        v-if="isLoading"
        class="voyado-search-results__spinner"
        :class="{
          empty: !hasProducts
        }"
        :loading="isLoading"
      />
      <div
        v-if="!hasProducts && !isLoading"
        class="voyado-search-results__no-results"
      >
        {{ $t('SEARCH_NO_RESULTS') }}
      </div>
      <div v-if="hasProducts" class="voyado-search-results__results">
        <VoyadoSearchResultsList :products="products" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VoyadoSearchReults',
  props: {
    products: {
      type: Array,
      required: true,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    totalResults: {
      type: Number,
      required: true,
      default: 0
    },
    searchQuery: {
      type: String,
      required: true,
      default: ''
    },
    hasProducts: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    resultsToShow() {
      return this.$store.getters.viewport === 'phone' ? 5 : 10;
    },
    setSearchPageUrl() {
      return (
        this.$getPath('index') +
        this.$config.routePaths.search +
        '/' +
        this.$data.searchQuery
      );
    }
  },
  methods: {
    visitSearchPage() {
      console.log(
        'VoyadoSearchResults: visitSearchPage',
        this.setSearchPageUrl
      );
      this.$router.push(this.setSearchPageUrl);
      this.$emit('voyadoSearchOnRouteChange');
    }
  }
};
</script>
