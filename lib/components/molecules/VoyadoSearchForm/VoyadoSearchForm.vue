<template>
  <div class="voyado-search-form">
    <input
      v-model="searchQuery"
      class="voyado-search__input"
      type="search"
      autocomplete="off"
      :aria-label="$t('SEARCH')"
      :placeholder="$t('SEARCH_PLACEHOLDER')"
      @input="fetchResults"
    />
    <!-- <input
      v-model="searchQuery"
      class="voyado-search__input"
      type="search"
      autocomplete="off"
      :aria-label="$t('SEARCH')"
      :placeholder="$t('SEARCH_PLACEHOLDER')"
      @input="handleSearchInput"
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
    typingTimeout: null,
    loading: false,
    products: [],
    primaryProductGroups: [],
    noResults: false
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
      this.loading = true;

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
              'voyado: primaryProductGroups',
              this.primaryProductGroups
            );
          }

          if (this.hasProductResults) {
            this.totalResults = results.primaryList.totalHits;
          } else {
            this.noResults = true;
          }

          this.loading = false;

          console.log('voyado: results', results);
        } catch (error) {
          this.$nuxt.error({ statusCode: error.statusCode, message: error });
          console.log('voyado: error', error);
        } finally {
          this.loading = false;
        }
      } else {
        this.primaryProductGroups = [];
        this.products = [];
        this.loading = false;
      }
    },
    // @vuese
    // Perform search
    async handleSearchInput() {
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
    }
  },
  destroy: {}
};
</script>
<!-- <style lang="scss">
.voyado-search-form {
}
</style> -->
