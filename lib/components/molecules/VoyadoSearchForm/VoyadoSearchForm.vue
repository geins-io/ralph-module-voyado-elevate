<template>
  <div class="voyado-search-form">
    <input
      v-model="searchInput"
      class="voyado-search__input"
      type="search"
      autocomplete="off"
      :aria-label="$t('SEARCH')"
      :placeholder="$t('SEARCH_PLACEHOLDER')"
      @input="onSearchInput"
      @focus="onFocus"
      @blur="onBlur"
      @keyup.enter="onEnter"
    />
    <CaIconButton
      v-if="localSearchQuery.length"
      class="voyado-search__remove"
      icon-name="x"
      aria-label="Delete"
      @clicked="onClear"
    />
    <CaIconButton
      class="voyado-search__button"
      icon-name="search"
      :aria-label="$t('SEARCH')"
      @clicked="onSubmit"
    />
  </div>
</template>
<script>
import { esales } from '@apptus/esales-api';

export default {
  name: 'VoyadoSearchForm',
  props: {
    searchQuery: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    isLoading: false,
    products: [],
    primaryProductGroups: [],
    noResults: false,
    totalResults: 0,
    localSearchQuery: ''
  }),
  computed: {
    hasProductResults() {
      return this.primaryProductGroups.length;
    },
    searchInput: {
      get() {
        return this.searchQuery;
      },
      set(newVal) {
        this.$emit('update:searchQuery', newVal);
      }
    }
  },
  methods: {
    esalesApi() {
      return esales({
        market: 'SE',
        locale: 'sv-SE',
        clusterId: 'wAFAF8CF4',
        touchpoint: 'desktop'
      });
    },
    async fetchResults() {
      this.isLoading = true;
      // console.log('VoyadoSearchForm: fetchResults', this.localSearchQuery);

      if (this.localSearchQuery.length) {
        try {
          const results = await this.esalesApi().query.searchPage({
            q: this.localSearchQuery,
            limit: 60
          });

          if (results?.primaryList?.productGroups?.length) {
            this.primaryProductGroups =
              results?.primaryList?.productGroups || [];
            this.getAllProducts();
            // console.log(
            //   'VoyadoSearchForm: primaryProductGroups',
            //   this.primaryProductGroups
            // );
          }

          if (this.hasProductResults) {
            this.totalResults = results.primaryList.totalHits;
          } else {
            this.noResults = true;
          }
          // console.log('VoyadoSearchForm: results', results);
        } catch (error) {
          this.$nuxt.error({ statusCode: error.statusCode, message: error });
          // console.log('VoyadoSearchForm: error', error);
        } finally {
          this.isLoading = false;
        }
      } else {
        this.primaryProductGroups = [];
        this.products = [];
        this.isLoading = false;
      }
    },
    // @vuese
    // Perform search
    onSearchInput(input) {
      this.$nextTick(() => {
        this.localSearchQuery += input.data;
        this.fetchResults();
        this.$emit('voyadoSearchOnInput', this.$data);
        console.log('VoyadoSearchForm: onSearchInput', this.localSearchQuery);
      });
    },
    getAllProducts() {
      const products = [];
      this.primaryProductGroups.forEach(item => {
        item.products.forEach(product => {
          products.push(product);
        });
      });
      this.products = products;
    },
    onFocus() {
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
