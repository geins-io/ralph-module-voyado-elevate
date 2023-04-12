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
      v-else-if="phraseSuggestions.length || recentSearches.length"
      class="voyado-search-results__results voyado-search-results__results--suggestions"
    >
      <div
        v-if="phraseSuggestions.length"
        class="voyado-search-results__phrase-suggestions"
      >
        <h2 class="voyado-search-results__title">
          {{ $t('VOYADO_SEARCH_RESULTS_SUGGESTIONS_TITLE') }}
        </h2>
        <ul>
          <li v-for="(suggestion, index) in phraseSuggestions" :key="index">
            <CaClickable
              class="voyado-search-results__suggestion"
              @clicked="setQuery(suggestion.q)"
            >
              {{ suggestion.q }}
            </CaClickable>
          </li>
        </ul>
      </div>
      <div
        v-if="recentSearches.length"
        class="voyado-search-results__recent-searches"
      >
        <h2 class="voyado-search-results__title">
          {{ $t('VOYADO_SEARCH_RECENT_SEARCHES_TITLE') }}
        </h2>
        <ul>
          <li v-for="(search, index) in recentSearches" :key="index">
            <CaClickable
              class="voyado-search-results__suggestion"
              @clicked="setQuery(search.q)"
            >
              {{ search.q }}
            </CaClickable>
          </li>
        </ul>
      </div>
    </div>
    <div
      v-else
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
    },
    phraseSuggestions: {
      type: Array,
      default: () => []
    },
    recentSearches: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    visitSearchPage() {
      this.$emit('voyadoSearchOnRouteChange');
    },
    setQuery(q) {
      this.$emit('update:searchQuery', q);
    }
  }
};
</script>
