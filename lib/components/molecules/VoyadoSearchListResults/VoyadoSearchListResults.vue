<template>
  <div
    class="voyado-search-list-results"
    :class="{ 'voyado-search-list-results--hidden': removed }"
  >
    <div
      v-if="isRecent || (isSuggestions && !searchQuery)"
      class="voyado-search-list-results__top"
    >
      <h2 class="voyado-search-list-results__title">
        {{ title }}
      </h2>
      <button
        v-if="isRecent"
        class="voyado-search-list-results__remove-recent"
        type="button"
        @click="removeRecent"
      >
        {{ $t('VOYADO_SEARCH_RESULTS_REMOVE_RECENT') }}
      </button>
    </div>

    <ul class="voyado-search-list-results__suggestions-list">
      <li v-for="(result, index) in resultList" :key="index">
        <CaClickable
          class="voyado-search-list-results__suggestion"
          @clicked="setQuery(result.q)"
          @click.native="
            $store.dispatch('events/push', {
              type: 'search:click',
              data: { type: 'suggestion', data: result }
            })
          "
        >
          <!-- eslint-disable vue/no-v-html -->
          <!-- eslint-disable vue/no-v-text-v-html-on-component -->
          <span
            v-if="isSuggestions"
            class="voyado-search-results__suggestion-text"
            v-html="formatHighlighted(result.highlighted)"
          />
          <span v-else class="voyado-search-list-results__suggestion-text">
            {{ result.q }}
          </span>
          <CaIconButton
            class="voyado-search-list-results__search-icon"
            icon-name="search"
            :aria-label="$t('SEARCH')"
          />
        </CaClickable>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'VoyadoSearchListResults',
  mixins: [],
  props: {
    mode: {
      type: String,
      default: 'recent',
      validator: value => ['recent', 'suggestions'].includes(value)
    },
    title: {
      type: String,
      required: true
    },
    resultList: {
      type: Array,
      required: true
    },
    searchQuery: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    removed: false
  }),
  computed: {
    isRecent() {
      return this.mode === 'recent';
    },
    isSuggestions() {
      return this.mode === 'suggestions';
    },
    origin() {
      switch (this.mode) {
        case 'recent':
          return 'RECENT_SEARCH';
        case 'suggestions':
          return 'PHRASE_SUGGEST';
        default:
          return 'ORGANIC';
      }
    }
  },
  watch: {
    resultList(val) {
      if (val.length) {
        this.removed = false;
      }
    }
  },
  mounted() {},
  methods: {
    removeRecent() {
      this.$emit('voyadoSearchRemoveRecent');
      this.removed = true;
    },
    setQuery(q) {
      this.$store.commit('setSearchOrigin', this.origin);
      this.$emit('voyadoSearchSetQuery', q);
    },
    formatHighlighted(text) {
      const formattedText = text.replace(/{(.*?)}/g, '<strong>$1</strong>');
      return formattedText;
    }
  }
};
</script>
