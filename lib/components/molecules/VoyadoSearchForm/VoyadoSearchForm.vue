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
        class="voyado-search-form__button"
        icon-name="search"
        :aria-label="$t('VOYADO_SEARCH_FORM')"
        @clicked="onSubmit"
      />
    </div>
  </div>
</template>
<script>
import { debounce } from 'lodash';
import { esales } from '@apptus/esales-api';
import VoyadoProps from 'ralph-module-voyado-elevate/lib/components/mixins/VoyadoProps.mjs';

export default {
  name: 'VoyadoSearchForm',
  mixins: [VoyadoProps],
  props: {
    searchQuery: {
      type: String,
      required: true
    },
    primaryProductGroups: {
      type: Array,
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
    totalResults: {
      type: Number,
      default: 0
    },
    hasResults: {
      type: Boolean,
      default: false
    },
    debounceTimeout: {
      type: Number,
      default: 500
    }
  },
  data: () => ({
    debounceSearch: null
  }),
  computed: {
    hasProductResults() {
      return this.primaryProductGroups.length;
    },
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
      this.debounceSearch();
      if (!newVal && !!oldVal) {
        this.$emit('update:hasResults', false);
        this.$emit('update:primaryProductGroups', []);
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
    esalesApi() {
      return esales({
        market: this.market,
        locale: this.localeIso,
        clusterId: this.clusterId,
        touchpoint: 'desktop'
      });
    },
    async fetchResults() {
      this.$emit('update:isLoading', true);
      try {
        const results = await this.esalesApi().query.autocomplete({
          q: this.searchQuery,
          limit: 60
        });

        console.log(results);

        if (results?.primaryList?.productGroups?.length) {
          this.$emit(
            'update:primaryProductGroups',
            results?.primaryList?.productGroups
          );
          this.getAllProducts();
        }

        if (results?.primaryList?.totalHits) {
          this.$emit('update:totalResults', results.primaryList.totalHits);
          this.$emit('update:hasResults', true);
        }

        if (results?.phraseSuggestions?.length) {
          this.$emit('update:phraseSuggestions', results.phraseSuggestions);
        }

        if (results?.recentSearches?.length) {
          this.$emit('update:recentSearches', results.recentSearches);
        }
      } catch (error) {
        this.$nuxt.error({ statusCode: error.statusCode, message: error });
      } finally {
        this.$emit('update:isLoading', false);
      }
    },
    getAllProducts() {
      const products = [];
      this.primaryProductGroups.forEach(item => {
        item.products.forEach(product => {
          products.push(product);
        });
      });
      this.$emit('update:products', products);
    },
    onFocus() {
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
    onSubmit() {
      this.$emit('voyadoSearchOnSubmit', this.$data);
    }
  }
};
</script>
