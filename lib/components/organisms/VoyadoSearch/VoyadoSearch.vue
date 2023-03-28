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
          :no-results.sync="noResults"
          :total-results.sync="totalResults"
          @voyadoSearchOnFocus="onFocus"
          @voyadoSearchOnBlur="onBlur"
          @voyadoSearchOnEnter="onEnter"
          @voyadoSearchOnClear="onClear"
          @voyadoSearchOnSubmit="onSubmit"
        />
      </div>
      <section
        v-if="
          isLoading ||
            (noResults && searchIsVisible) ||
            (hasProductResults && searchIsVisible)
        "
        class="voyado-search__results"
        :class="{
          'voyado-search__results--loading': isLoading,
          'voyado-search__results--loading-empty':
            isLoading && !hasProductResults,
          'voyado-search__results--no-results': noResults
        }"
      >
        <VoyadoSearchResults
          :products="products"
          :total-results="totalResults"
          :is-loading="isLoading"
          :search-query="searchQuery"
          :has-products="hasProductResults"
        />
        <button
          type="button"
          class="voyado-search__close-button only-mobile"
          @click="onClose"
        >
          <CaIconAndText icon-name="x">
            {{ $t('Close') }}
          </CaIconAndText>
        </button>
      </section>
    </div>
    <CaOverlay
      class="voyado-search__overlay"
      :visible="isActive"
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
  mixins: [],
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
    isActive: false,
    products: [],
    primaryProductGroups: [],
    totalResults: 0,
    searchStorage: null,
    noResults: false
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
    modifiers() {
      return {
        'voyado-search--visible': this.searchIsVisible,
        'voyado-search--active': this.isActive
      };
    },
    productsVisible() {
      return this.products.slice(0, this.resultsToShow);
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
      if (!this.isActive) {
        this.isActive = true;
        this.$store.dispatch('setViewportHeight');
        this.$store.dispatch('setScrollbarWidth');
        document.body.style.overflow = 'hidden';
      }
    },
    onClose() {
      document.body.style.overflow = null;
      this.noResults = false;
      this.isActive = false;
      this.onClear();
      this.$emit('voyadoSearchOnClose');
    }
  }
};
</script>
