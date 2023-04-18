<template>
  <div
    class="voyado-search-results"
    :class="{
      'voyado-search-results--empty':
        !recentSearches.length &&
        !phraseSuggestions.length &&
        !hasResults &&
        isLoading
    }"
  >
    <div class="voyado-search-results__container">
      <div v-if="isLoading" class="voyado-search-results__loading">
        <CaSpinner
          class="voyado-search-results__spinner"
          :loading="isLoading"
        />
      </div>
      <VoyadoSearchListResults
        v-if="recentSearches.length && !hasResults"
        mode="recent"
        :title="$t('VOYADO_SEARCH_RECENT_SEARCHES_TITLE')"
        :result-list="recentSearches"
        :search-query="searchQuery"
        class="voyado-search-results__results voyado-search-results__results--list"
        @voyadoSearchRemoveRecent="removeRecent"
        @voyadoSearchSetQuery="setQuery"
      />
      <VoyadoSearchListResults
        v-if="phraseSuggestions.length"
        mode="suggestions"
        :title="$t('VOYADO_SEARCH_RESULTS_SUGGESTIONS_TITLE')"
        :result-list="phraseSuggestions"
        :search-query="searchQuery"
        class="voyado-search-results__results voyado-search-results__results--list"
        @voyadoSearchSetQuery="setQuery"
      />
      <div
        v-if="hasResults"
        class="voyado-search-results__results voyado-search-results__results--products"
      >
        <VoyadoSearchProductResults :products="products" />
      </div>
      <div
        v-else-if="searchQuery && !hasResults && !isLoading"
        class="voyado-search-results__results voyado-search-results__results--empty"
      >
        <p>
          {{ $t('VOYADO_SEARCH_RESULTS_NO_MATCH') }}
        </p>
      </div>
    </div>
    <CaButton
      v-if="
        ((!searchQuery || !!totalHits) && !isLoading) ||
          (isLoading && searchQuery)
      "
      :disabled="!totalHits"
      type="full-width"
      class="voyado-search-results__button"
      @clicked="visitSearchPage"
    >
      {{ $tc('VOYADO_SEARCH_RESULTS_BUTTON', totalHits, { hits: totalHits }) }}
    </CaButton>
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
    totalHits: {
      type: Number,
      default: 0
    },
    searchQuery: {
      type: String,
      default: ''
    },
    phraseSuggestions: {
      type: Array,
      default: () => []
    },
    recentSearches: {
      type: Array,
      default: () => []
    },
    hasResults: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    visitSearchPage() {
      this.$emit('voyadoSearchOnRouteChange');
    },
    setQuery(q) {
      this.$emit('update:searchQuery', q);
    },
    formatHighlighted(text) {
      const formattedText = text.replace(/{(.*?)}/g, '<strong>$1</strong>');
      return formattedText;
    },
    removeRecent() {
      this.$emit('voyadoSearchRemoveRecent');
    }
  }
};
</script>
