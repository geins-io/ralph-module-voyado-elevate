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
        v-if="isLoading || isFocus"
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
          @voyadoSearchOnRouteChange="visitSearchPage"
        />
        <button
          v-if="hasResults"
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
import VoyadoProps from 'ralph-module-voyado-elevate/lib/components/mixins/VoyadoProps.mjs';

// @group Molecules
// The search including search results<br><br>
// **SASS-path:** _./styles/components/molecules/voyado-search.scss_
export default {
  name: 'VoyadoSearch',
  mixins: [VoyadoProps],
  props: {
    isVisible: {
      type: Boolean,
      default: true
    },
    productResultsLimit: {
      type: Number,
      default: 10
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
    modifiers() {
      return {
        'voyado-search--visible': this.isVisible,
        'voyado-search--focus': this.isFocus
      };
    },
    hasProductResults() {
      return !!this.products.length;
    },
    productResults() {
      return this.products.slice(0, this.productResultsLimit);
    },
    searchPageUrl() {
      const index =
        this.$getPath('index') === '/' ? '' : this.$getPath('index');
      return index + this.$config.routePaths.search + '/' + this.searchQuery;
    }
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
  },
  beforeDestroy() {
    eventbus.$off('route-change');
  },
  methods: {
    visitSearchPage() {
      this.$router.push(this.searchPageUrl);
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
      if (this.isFocus === false) {
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
