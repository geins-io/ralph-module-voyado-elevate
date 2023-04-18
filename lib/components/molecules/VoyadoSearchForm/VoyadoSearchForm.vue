<template>
  <div class="voyado-search-form">
    <div class="voyado-search-form__input-wrap">
      <input
        v-model="localSearchQuery"
        class="voyado-search-form__input"
        type="search"
        autocomplete="off"
        :aria-label="$t('VOYADO_SEARCH_FORM')"
        :placeholder="$t('VOYADO_SEARCH_FORM_PLACEHOLDER')"
        @focus="onFocus"
        @blur="onBlur"
        @keyup.enter="onEnter"
      />
      <CaIconButton
        v-if="searchQuery.length"
        class="voyado-search-form__remove"
        icon-name="x"
        aria-label="Delete"
        @clicked="onClear"
      />
      <CaIconButton
        v-else
        class="voyado-search-form__button"
        icon-name="search"
        :aria-label="$t('VOYADO_SEARCH_FORM')"
        @clicked="onSubmit"
      />
    </div>
    <CaIconButton
      v-if="isFocus"
      class="voyado-search-form__close only-mobile"
      icon-name="x"
      aria-label="Close"
      @clicked="onClose"
    />
  </div>
</template>
<script>
import { debounce } from 'lodash';
import VoyadoProps from 'ralph-module-voyado-elevate/lib/components/mixins/VoyadoProps.mjs';

export default {
  name: 'VoyadoSearchForm',
  mixins: [VoyadoProps],
  props: {
    searchQuery: {
      type: String,
      required: true
    },
    products: {
      type: Array,
      default: () => []
    },
    phraseSuggestions: {
      type: Array,
      default: () => []
    },
    recentSearches: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    totalHits: {
      type: Number,
      default: 0
    },
    debounceTimeout: {
      type: Number,
      default: 500
    },
    api: {
      type: Function,
      required: true
    },
    isFocus: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    debounceSearch: null
  }),
  computed: {
    localSearchQuery: {
      get() {
        return this.searchQuery;
      },
      set(newVal) {
        this.$emit('update:searchQuery', newVal);
      }
    }
  },
  watch: {
    localSearchQuery(newVal, oldVal) {
      this.$emit('voyadoSearchOnQueryChange', this.$data);
      this.$emit('update:isLoading', true);
      this.debounceSearch();
      if (!newVal && !!oldVal) {
        this.$emit('update:totalHits', 0);
        this.$emit('update:products', []);
        this.$emit('update:isLoading', false);
        this.onClear();
      }
    }
  },
  created() {
    this.debounceSearch = debounce(this.fetchResults, this.debounceTimeout);
  },
  methods: {
    async fetchResults() {
      try {
        const results = await this.api().query.autocomplete({
          q: this.searchQuery,
          limit: 60
        });

        console.log(results);

        this.$emit('update:totalHits', results.totalHits);

        if (results?.productSuggestions) {
          this.setProductSuggestions(results.productSuggestions);
        }

        if (results?.phraseSuggestions) {
          this.$emit('update:phraseSuggestions', results.phraseSuggestions);
        }

        if (results?.recentSearches) {
          this.$emit('update:recentSearches', results.recentSearches);
        }
      } catch (error) {
        this.$nuxt.error({ statusCode: error.statusCode, message: error });
      } finally {
        this.$emit('update:isLoading', false);
      }
    },
    setProductSuggestions(suggestionGroups) {
      const products = [];
      suggestionGroups.forEach(group => {
        // Push first product of every suggestion group
        products.push(group.products[0]);
      });
      this.$emit('update:products', products);
    },
    onFocus() {
      this.$emit('update:isLoading', true);
      this.fetchResults();
      this.$emit('voyadoSearchOnFocus', this.$data);
    },
    onBlur() {
      this.$emit('voyadoSearchOnBlur', this.$data);
    },
    onEnter() {
      this.$emit('voyadoSearchOnEnter', this.$data);
    },
    onClear() {
      this.$emit('voyadoSearchOnClear', this.$data);
    },
    onClose() {
      this.$emit('voyadoSearchOnClose', this.$data);
    },
    onSubmit() {
      this.$emit('voyadoSearchOnSubmit', this.$data);
    }
  }
};
</script>
