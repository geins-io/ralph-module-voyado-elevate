<template>
  <div class="voyado-search__wrapper">
    <div ref="search" class="voyado-search" :class="modifiers">
      <div class="voyado-search__bar">
        <VoyadoSearchForm
          class="voyado-search__form"
          :search-query.sync="searchQuery"
          @voyadoSearchOnInput="onSearchInput"
          @voyadoSearchOnFocus="onOpen"
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
        <div class="voyado-search__results-box">
          <div class="voyado-search__top">
            <h2 class="voyado-search__title">
              {{ $t('SEARCH_RESULTS_TITLE') }}
            </h2>
            <button type="button" @click="visitSearchPage">
              <CaIconAndText
                v-if="hasProductResults && totalResults > resultsToShow"
                class="voyado-search__see-all"
                icon-name="arrow-right"
                icon-position="right"
              >
                {{ $t('SEARCH_RESULTS_SEE_ALL') }}
              </CaIconAndText>
            </button>
          </div>
          <div class="voyado-search__results-wrap">
            <CaSpinner
              v-if="isLoading"
              class="voyado-search__spinner"
              :class="{
                empty: !hasProductResults
              }"
              :loading="isLoading"
            />
            <div
              v-if="noResults && !isLoading"
              class="voyado-search__no-results"
            >
              {{ $t('SEARCH_NO_RESULTS') }}
            </div>
            <div
              v-if="hasProductResults"
              class="voyado-search__result voyado-search__result--products"
            >
              <h3 class="voyado-search__list-title">
                {{ $tc('PRODUCT', 2) }}
              </h3>
              <div
                v-for="productGroup in primaryProductGroups"
                :key="productGroup.key"
              >
                <ul
                  v-if="productGroup.products.length"
                  class="voyado-search__list voyado-search__list--primary"
                >
                  <li
                    v-for="product in productGroup.products"
                    :key="product.key"
                    class="voyado-search__item voyado-search__item--product"
                  >
                    <!-- <NuxtLink
                      class="voyado-search__item-link voyado-search__item-link--product"
                      :to="product.canonicalUrl"
                      :title="product.name"
                    > -->
                    <div class="voyado-search__item-image">
                      <CaImage
                        v-if="product.imageInfo.thumbnail"
                        class="voyado-search__item-image"
                        type="product"
                        :ratio="$config.productImageRatio"
                        :src="product.imageInfo.thumbnail"
                        :alt="product.title"
                        sizes="40px"
                      />
                      <CaImage
                        v-else
                        class="voyado-search__item-image"
                        :ratio="$config.productImageRatio"
                        :src="
                          require('~/assets/placeholders/product-image-square.png')
                        "
                        alt="placeholder"
                      />
                    </div>
                    <div class="voyado-search__item-info">
                      <div class="voyado-search__item-name">
                        {{ product.title }}
                      </div>
                      <div class="voyado-search__price">
                        <span class="voyado-search____selling">
                          {{ product.sellingPrice.min }}
                        </span>
                      </div>
                    </div>
                    <!-- </NuxtLink> -->
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
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
    isLoading: false,
    isActive: false,
    products: [],
    primaryProductGroups: [],
    totalResults: 0,
    searchStorage: null,
    noResults: false
  }),
  computed: {
    searchQuery: {
      get() {
        return this.$data.searchQuery;
      },
      set(newVal) {
        this.$data.searchQuery = newVal;
      }
    },
    setSearchPageUrl() {
      return (
        this.$getPath('index') +
        this.$config.routePaths.search +
        '/' +
        this.$data.searchQuery
      );
    },
    resultsToShow() {
      return this.$store.getters.viewport === 'phone' ? 5 : 10;
    },
    hasProductResults() {
      return this.primaryProductGroups.length;
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
    updateSearchQuery(newVal) {
      this.$data.searchQuery = newVal;
    },
    onSearchInput(data) {
      console.log('VoyadoSearch: onSearchInput', data);
      this.isLoading = data.isLoading;
      this.noResults = data.noResults;
      this.products = data.products;
      this.primaryProductGroups = data.primaryProductGroups;
      this.totalResults = data.totalResults;
      this.updateSearchQuery(data.localSearchQuery);
    },
    onBlur() {
      this.$nextTick(() => {
        if (this.$data.searchQuery === '') {
          this.onClose();
        }
      });
    },
    onEnter() {
      if (this.$data.searchQuery.length) {
        console.log('VoyadoSearch: onEnter', this.$data.searchQuery.length);
        this.visitSearchPage();
        this.onClose();
      }
    },
    onSubmit() {
      if (this.$data.searchQuery.length) {
        console.log('VoyadoSearch: onSubmit', this.$data.searchQuery.length);
        this.visitSearchPage();
        this.onClose();
      }
    },
    onClear() {
      if (this.$data.searchQuery.length) {
        console.log('VoyadoSearch: onClear', this.$data.searchQuery.length);
        this.updateSearchQuery('');
      }
    },
    onClose() {
      document.body.style.overflow = null;
      this.noResults = false;
      this.isActive = false;
      this.products = [];
      this.updateSearchQuery('');
      this.$emit('voyadoSearchOnClose');
    },
    onOpen() {
      if (!this.isActive) {
        this.isActive = true;
        this.$store.dispatch('setViewportHeight');
        this.$store.dispatch('setScrollbarWidth');
        document.body.style.overflow = 'hidden';
      }
    }
  }
};
</script>
<style lang="scss">
// @import 'molecules/voyado-search';
</style>
