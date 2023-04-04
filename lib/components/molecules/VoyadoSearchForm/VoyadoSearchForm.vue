<template>
  <div class="voyado-search-form">
    <div class="voyado-search-form__input-wrap">
      <input
        v-model="localSearchQuery"
        class="voyado-search-form__input"
        type="search"
        autocomplete="off"
        :aria-label="$t('VOYADO_SEARCH')"
        :placeholder="$t('VOYADO_SEARCH_PLACEHOLDER')"
        @input="onSearchInput"
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
        :aria-label="$t('VOYADO_SEARCH')"
        @clicked="onSubmit"
      />
    </div>
  </div>
</template>
<script>
import { esales } from '@apptus/esales-api';

export default {
  name: 'VoyadoSearchForm',
  props: {
    clusterId: {
      type: String,
      required: true
    },
    market: {
      type: String,
      required: true
    },
    localeIso: {
      type: String,
      required: true
    },
    searchQuery: {
      type: String,
      required: true,
      default: ''
    },
    primaryProductGroups: {
      type: Array,
      required: true,
      default: () => []
    },
    products: {
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
    }
  },
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

      if (this.searchQuery.length) {
        try {
          const results = await this.esalesApi().query.searchPage({
            q: this.searchQuery,
            limit: 60
          });

          if (results?.primaryList?.productGroups?.length) {
            this.$emit(
              'update:primaryProductGroups',
              results?.primaryList?.productGroups || []
            );
            this.getAllProducts();
          }

          if (results?.primaryList?.totalHits) {
            this.$emit('update:totalResults', results.primaryList.totalHits);
            this.$emit('update:hasResults', true);
          }
        } catch (error) {
          this.$nuxt.error({ statusCode: error.statusCode, message: error });
        } finally {
          this.$emit('update:isLoading', false);
        }
      } else {
        this.$emit('update:hasResults', false);
        this.$emit('update:primaryProductGroups', []);
        this.$emit('update:products', []);
        this.$emit('update:isLoading', false);
        this.onClear();
      }
    },
    // @vuese
    // Perform search
    onSearchInput() {
      this.$nextTick(() => {
        this.fetchResults();
        this.$emit('voyadoSearchOnInput', this.$data);
      });
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
