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
      <div
        v-if="recentSearches.length && !hasResults"
        class="voyado-search-results__results voyado-search-results__results--suggestions"
      >
        <div class="voyado-search-results__top">
          <h2 class="voyado-search-results__title">
            {{ $t('VOYADO_SEARCH_RECENT_SEARCHES_TITLE') }}
          </h2>
          <button
            class="voyado-search-results__remove-recent"
            type="button"
            @click="removeRecent"
          >
            {{ $t('VOYADO_SEARCH_RESULTS_REMOVE_RECENT') }}
          </button>
        </div>

        <ul class="voyado-search-results__suggestions-list">
          <li v-for="(search, index) in recentSearches" :key="index">
            <CaClickable
              class="voyado-search-results__suggestion"
              @clicked="setQuery(search.q)"
            >
              <span class="voyado-search-results__suggestion-text">
                {{ search.q }}
              </span>
              <CaIconButton
                class="voyado-search-results__search-icon"
                icon-name="search"
                :aria-label="$t('SEARCH')"
              />
            </CaClickable>
          </li>
        </ul>
      </div>
      <div
        v-if="phraseSuggestions.length"
        class="voyado-search-results__results voyado-search-results__results--suggestions"
      >
        <div v-if="!searchQuery" class="voyado-search-results__top">
          <h2 class="voyado-search-results__title">
            {{ $t('VOYADO_SEARCH_RESULTS_SUGGESTIONS_TITLE') }}
          </h2>
        </div>

        <ul class="voyado-search-results__suggestions-list">
          <li v-for="(suggestion, index) in phraseSuggestions" :key="index">
            <CaClickable
              class="voyado-search-results__suggestion"
              @clicked="setQuery(suggestion.q)"
            >
              <!-- eslint-disable vue/no-v-html -->
              <!-- eslint-disable vue/no-v-text-v-html-on-component -->
              <span
                class="voyado-search-results__suggestion-text"
                v-html="formatHighlighted(suggestion.highlighted)"
              />
              <CaIconButton
                class="voyado-search-results__search-icon"
                icon-name="search"
                :aria-label="$t('SEARCH')"
              />
            </CaClickable>
          </li>
        </ul>
      </div>
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
