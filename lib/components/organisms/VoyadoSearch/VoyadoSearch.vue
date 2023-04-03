<template>
  <div class="voyado-search__wrapper">
    <div ref="search" class="voyado-search" :class="modifiers">
      <div class="voyado-search__bar">
        <VoyadoSearchForm
          class="voyado-search__form"
          :search-query.sync="searchQuery"
          :primary-product-groups.sync="primaryProductGroups"
          :products.sync="products"
          :is-loading.sync="isLoading"
          :has-results.sync="hasResults"
          :total-results.sync="totalResults"
          @voyadoSearchOnFocus="onFocus"
          @voyadoSearchOnBlur="onBlur"
          @voyadoSearchOnEnter="onEnter"
          @voyadoSearchOnClear="onClear"
          @voyadoSearchOnSubmit="onSubmit"
        />
      </div>
      <div
        v-if="isLoading || (searchIsVisible && isFocus)"
        class="voyado-search__results-container"
        :class="{
          'voyado-search__results-container--loading': isLoading,
          'voyado-search__results-container--loading-empty':
            isLoading && !hasProductResults,
          'voyado-search__results-container--empty': !hasResults,
          'voyado-search__results-container--suggestions':
            !isLoading && isFocus && !hasResults
        }"
      >
        <VoyadoSearchResults
          :products="productResults"
          :total-results="totalResults"
          :is-loading="isLoading"
          :is-focus="isFocus"
          :search-query="searchQuery"
          :has-products="hasProductResults"
        />
        <button
          type="button"
          class="voyado-search__close-button only-mobile"
          @click="onClose"
        >
          <CaIconAndText icon-name="x">
            {{ $t('VOYADO_SEARCH_CLOSE') }}
          </CaIconAndText>
        </button>
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
import eventbus from 'ralph-module-voyado-elevate/lib/module.eventbus';

// @group Molecules
// The search including search results<br><br>
// **SASS-path:** _./styles/components/molecules/voyado-search.scss_
export default {
  name: 'VoyadoSearch',
  props: {
    // Used to toogle search in mobile, set to true when user opens it
    onOpened: {
      type: Boolean,
      default: false
    },
    visibleWhenSiteIsAtTop: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    searchQuery: '',
    isLoading: false,
    isFocus: false,
    products: [],
    primaryProductGroups: [],
    totalResults: 0,
    searchStorage: null,
    hasResults: false
  }),
  computed: {
    hasProductResults() {
      return !!this.products.length;
    },
    searchIsVisible() {
      if (this.visibleWhenSiteIsAtTop) {
        if (
          this.$store.getters.viewport === 'phone' ||
          this.$store.getters.viewport === 'tablet'
        ) {
          return this.$store.getters.siteIsAtTop || this.opened;
        } else {
          return true;
        }
      } else {
        return this.$store.getters.viewport === 'phone' ||
          this.$store.getters.viewport === 'tablet'
          ? this.opened
          : true;
      }
    },
    productResultsLimit() {
      return this.$store.getters.viewport === 'phone' ? 5 : 10;
    },
    modifiers() {
      return {
        'voyado-search--visible': this.searchIsVisible,
        'voyado-search--focus': this.isFocus
      };
    },
    productResults() {
      return this.products.slice(0, this.productResultsLimit);
    },
    setSearchPageUrl() {
      return (
        this.$getPath('index') +
        this.$config.routePaths.search +
        '/' +
        this.searchQuery
      );
    }
  },
  mounted() {
    this.searchStorage = window.localStorage;
    eventbus.$on('route-change', () => {
      this.onClose();
    });
  },
  beforeDestroy() {
    eventbus.$off('route-change');
  },
  methods: {
    visitSearchPage() {
      this.$router.push(this.setSearchPageUrl);
      this.$emit('voyadoSearchOnRouteChange');
    },
    onBlur() {
      this.$nextTick(() => {
        if (this.searchQuery === '') {
          this.onClose();
        }
      });
    },
    onEnter() {
      if (this.searchQuery.length) {
        this.visitSearchPage();
        this.onClose();
      }
    },
    onSubmit() {
      if (this.searchQuery.length) {
        this.visitSearchPage();
        this.onClose();
      }
    },
    onClear() {
      this.searchQuery = '';
      this.products = [];
    },
    onFocus() {
      if (!this.isFocus) {
        this.isFocus = true;
        this.$store.dispatch('setViewportHeight');
        this.$store.dispatch('setScrollbarWidth');
        document.body.style.overflow = 'hidden';
      }
    },
    onClose() {
      document.body.style.overflow = null;
      this.hasResults = false;
      this.isFocus = false;
      this.onClear();
      this.$emit('voyadoSearchOnClose');
    }
  }
};
</script>
<style lang="scss">
@import 'organisms/voyado-search';
</style>
