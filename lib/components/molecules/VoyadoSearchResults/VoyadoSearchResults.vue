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
          {{ $t('VOYADO_SEARCH_SEARCH_TITLE') }}
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
            {{ $t('VOYADO_SEARCH_SEE_ALL') }}
          </CaIconAndText>
        </button>
      </div>
      <VoyadoSearchProductResultsList :products="products" />
    </div>
    <div
      v-else-if="!hasProducts && !isLoading"
      class="voyado-search-results__results voyado-search-results__results--empty"
    >
      <p v-if="searchQuery.length === 0">
        {{ $t('VOYADO_SEARCH_EMPTY_QUERY') }}
      </p>
      <p v-else>
        {{ $t('VOYADO_SEARCH_NO_MATCH') }}
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
  computed: {
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
      this.$router.push(this.setSearchPageUrl);
      this.$emit('voyadoSearchOnRouteChange');
    }
  }
};
</script>
