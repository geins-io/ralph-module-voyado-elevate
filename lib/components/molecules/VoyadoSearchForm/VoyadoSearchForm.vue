<template>
  <div class="voyado-search-form">
    <input
      v-model="localSearchQuery"
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
    totalResults: 0
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
        this.$data.localSearchQuery = newVal;
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
      // console.log('VoyadoSearchForm: fetchResults', this.$data.localSearchQuery);

      if (this.$data.localSearchQuery.length) {
        try {
          const results = await this.esalesApi().query.searchPage({
            q: this.$data.localSearchQuery,
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
        this.onClear();
      }
    },
    // @vuese
    // Perform search
    onSearchInput() {
      this.$nextTick(() => {
        this.fetchResults();
        this.$emit('voyadoSearchOnInput', this.$data);
        // console.log(
        //   'VoyadoSearchForm: onSearchInput',
        //   this.$data.localSearchQuery
        // );
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
