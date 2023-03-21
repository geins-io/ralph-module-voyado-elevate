<template>
  <div class="voyado-search-form">
    <input
      v-model="searchQuery"
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
    <!-- <input
      v-model="searchQuery"
      class="voyado-search__input"
      type="search"
      autocomplete="off"
      :aria-label="$t('SEARCH')"
      :placeholder="$t('SEARCH_PLACEHOLDER')"
      @input="onSearchInput"
      @focus="open"
      @blur="blurHandler"
      @keyup.enter="goToSearchPage"
    /> -->
    <!-- <CaIconButton
      v-if="searchQuery"
      class="voyado-search__remove"
      icon-name="x"
      aria-label="Delete"
      @clicked="close"
    />
    <CaIconButton
      class="voyado-search__button"
      icon-name="search"
      :aria-label="$t('SEARCH')"
      @clicked="goToSearchPage"
    /> -->
  </div>
</template>
<script>
import { esales } from '@apptus/esales-api';

export default {
  name: 'VoyadoSearchForm',
  mixins: [],
  props: {},
  data: () => ({
    searchQuery: '',
    isTypingTimeout: null,
    isLoading: false,
    products: [],
    primaryProductGroups: [],
    noResults: false,
    totalResults: 0
  }),
  computed: {
    hasProductResults() {
      return this.primaryProductGroups.length;
    }
  },
  watch: {},
  mounted() {},
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

      if (this.searchQuery !== '') {
        try {
          const results = await this.esalesApi().query.searchPage({
            q: this.searchQuery,
            limit: 60
          });

          if (results?.primaryList?.productGroups?.length) {
            this.primaryProductGroups =
              results?.primaryList?.productGroups || [];
            this.products = this.getAllProducts();
            console.log(
              'VoyadoSearchForm: primaryProductGroups',
              this.primaryProductGroups
            );
          }

          if (this.hasProductResults) {
            this.totalResults = results.primaryList.totalHits;
          } else {
            this.noResults = true;
          }

          this.isLoading = false;

          console.log('VoyadoSearchForm: results', results);
        } catch (error) {
          this.$nuxt.error({ statusCode: error.statusCode, message: error });
          console.log('VoyadoSearchForm: error', error);
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
    async onSearchInput() {
      // clearTimeout(this.isTypingTimeout);
      // this.isTypingTimeout = setTimeout(this.fetchResults(results), 500);
      await this.fetchResults();
      this.$emit('search', this.$data);
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
      this.$emit('focus');
    },
    onBlur() {
      this.$emit('blur');
    },
    onEnter() {
      this.$emit('enter');
    }
  },
  destroy: {}
};
</script>
<!-- <style lang="scss">
.voyado-search-form {
}
</style> -->
