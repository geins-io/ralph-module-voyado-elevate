<template>
  <div class="voyado-search__wrapper">
    <div ref="search" class="voyado-search" :class="modifiers">
      <div class="voyado-search__bar">
        <VoyadoSearchForm
          ref="searchForm"
          class="voyado-search__form"
          :search-query.sync="searchQuery"
          :products.sync="products"
          :is-loading.sync="isLoading"
          :total-hits.sync="totalHits"
          :phrase-suggestions.sync="phraseSuggestions"
          :recent-searches.sync="recentSearches"
          :is-focus="isFocus"
          @voyadoSearchOnFocus="onFocus"
          @voyadoSearchOnBlur="onBlur"
          @voyadoSearchOnEnter="onEnter"
          @voyadoSearchOnClear="onClear"
          @voyadoSearchOnSubmit="onSubmit"
          @voyadoSearchOnClose="onClose"
        />
      </div>
      <div
        v-if="isLoading || isFocus"
        class="voyado-search__results-container"
        :class="{
          'voyado-search__results-container--loading': isLoading,
          'voyado-search__results-container--suggestions':
            !isLoading && isFocus && !totalHits
        }"
      >
        <VoyadoSearchResults
          :products="products"
          :total-hits="totalHits"
          :is-loading="isLoading"
          :is-focus="isFocus"
          :search-query.sync="searchQuery"
          :phrase-suggestions="phraseSuggestions"
          :recent-searches="recentSearches"
          :has-results="hasResults"
          @voyadoSearchOnRouteChange="visitSearchPage"
          @voyadoSearchRemoveRecent="onRemoveRecent"
          @voyadoSearchOnProductClick="onClose"
        />
      </div>
    </div>
    <CaOverlay
      class="voyado-search__overlay"
      :visible="isFocus"
      @clicked="onClose"
    />
  </div>
</template>
<script>
import eventbus from '@geins/ralph-module-voyado-elevate/lib/module.eventbus';
import { mapState } from 'vuex';
// @group Molecules
// The search including search results<br><br>
// **SASS-path:** _./styles/components/molecules/voyado-search.scss_
export default {
  name: 'VoyadoSearch',
  mixins: [],
  props: {
    isVisible: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    searchQuery: '',
    isLoading: false,
    isFocus: false,
    products: [],
    totalHits: 0,
    searchStorage: null,
    phraseSuggestions: [],
    recentSearches: []
  }),
  computed: {
    modifiers() {
      return {
        'voyado-search--visible': this.isVisible,
        'voyado-search--focus': this.isFocus
      };
    },
    searchPageUrl() {
      const index =
        this.$getPath('index') === '/' ? '' : this.$getPath('index');
      return index + this.$config.routePaths.search + '/' + this.searchQuery;
    },
    hasResults() {
      return this.totalHits > 0 && !!this.searchQuery;
    },
    ...mapState(['voyado'])
  },
  watch: {
    searchQuery(val) {
      if (val.length && this.isFocus === false) {
        this.onFocus();
      }
    }
  },
  mounted() {
    this.searchStorage = window.localStorage;
    eventbus.$on('route-change', () => {
      this.onClose();
    });
    if (!this.voyado.api) {
      this.$store.dispatch('initVoyado');
    }
  },
  beforeDestroy() {
    eventbus.$off('route-change');
  },
  methods: {
    visitSearchPage() {
      this.$router.push(this.searchPageUrl);
      this.$emit('voyadoSearchOnRouteChange');
      this.onClose();
    },
    onBlur() {},
    onEnter() {
      if (this.searchQuery.length) {
        this.visitSearchPage();
      }
    },
    onSubmit() {
      if (this.searchQuery.length) {
        this.visitSearchPage();
      }
    },
    onClear() {
      this.searchQuery = '';
      this.products = [];
    },
    onFocus() {
      if (this.isFocus === false) {
        this.isFocus = true;
        this.$store.dispatch('setViewportHeight');
        this.$store.dispatch('setScrollbarWidth');
        document.body.style.overflow = 'hidden';
      }
    },
    onClose() {
      document.body.style.overflow = null;
      this.isFocus = false;
      this.onClear();
      this.$emit('voyadoSearchOnClose');
    },
    async onRemoveRecent() {
      this.isLoading = true;
      try {
        await this.voyado.api.notify.removeRecentSearches('removeAll');
      } catch (error) {
        this.$nuxt.error({ statusCode: error.statusCode, message: error });
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
<style lang="scss">
@import 'organisms/voyado-search';
</style>
