<template>
  <div class="voyado-search__wrapper">
    <div ref="search" class="voyado-search" :class="modifiers">
      <div class="voyado-search__bar">
        <VoyadoSearchForm
          class="voyado-search__form"
          @voyadoSearchOnInput="onSearchInput"
          @voyadoSearchOnFocus="onOpen"
          @voyadoSearchOnBlur="onBlur"
          @voyadoSearchOnEnter="onEnter"
        />
      </div>
      <!-- <div
        v-if="!isLoading && isActive && !hasProductResults && !noResults"
        class="voyado-search__suggestions"
      >
        <h2 class="voyado-search__title voyado-search__title--suggestion">
          {{ $t('YOUR_RECENT_SEARCHES') }}
        </h2>
        <ul v-if="showRecentSearches" class="voyado-search__suggestions-list">
          <li
            v-for="(search, index) in recentSearches"
            :key="index"
            class="voyado-search__suggestion-item"
          >
            <button
              type="button"
              class="voyado-search__suggestion-link"
              @mousedown="setSearchQuery(search)"
            >
              {{ search }}
            </button>
          </li>
        </ul>
        <p v-else class="voyado-search__no-suggestions">
          {{ $t('SEARCH_NO_SUGGESTIONS') }}
        </p>
      </div> -->
      <!-- <div
        v-else-if="isActive && !hasProductResults"
        class="voyado-search__suggestions"
      >
        <h2 class="voyado-search__title voyado-search__title--suggestion">
          {{ $t('TOP_SEARCHES') }}
        </h2>
        <ul class="voyado-search__suggestions-list">
          <li
            v-for="(search, index) in topSearches"
            :key="index"
            class="voyado-search__suggestion-item"
          >
            <a href="#" class="voyado-search__suggestion-link">{{ search }}</a>
          </li>
        </ul>
      </div> -->
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
            <button type="button" @click="goToSearchPage">
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
              v-if="primaryProductGroups.length"
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
            <!-- <div
              v-if="categoriesVisible.length"
              class="voyado-search__result voyado-search__result--categories"
            >
              <h3 class="voyado-search__list-title">{{ $t('CATEGORIES') }}</h3>
              <ul class="voyado-search__list">
                <li
                  v-for="(category, index) in categoriesVisible"
                  :key="index"
                  class="voyado-search__item voyado-search__item--tag"
                >
                  <NuxtLink
                    class="voyado-search__item-link voyado-search__item-link--tag"
                    :to="category.canonicalUrl"
                    :title="category.name"
                  >
                    {{ category.name }}
                  </NuxtLink>
                </li>
              </ul>
            </div> -->
            <!-- <div
              v-if="brandsVisible.length"
              class="voyado-search__result voyado-search__result--brands"
            >
              <h3 class="voyado-search__list-title">{{ $t('BRANDS') }}</h3>
              <ul class="voyado-search__list">
                <li
                  v-for="(brand, index) in brandsVisible"
                  :key="index"
                  class="voyado-search__item voyado-search__item--tag"
                >
                  <NuxtLink
                    class="voyado-search__item-link voyado-search__item-link--tag"
                    :to="brand.canonicalUrl"
                    :title="brand.name"
                  >
                    {{ brand.name }}
                  </NuxtLink>
                </li>
              </ul>
            </div> -->
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
// import searchQuery from 'global/search.graphql';
import eventbus from 'ralph-module-voyado-elevate/lib/module.eventbus';
// import eventbus from '@ralph/ralph-ui/plugins/eventbus.js';
// const eventbus = require('ralph-module-voyado-elevate/lib/eventBus');
// import { esales } from '@apptus/esales-api';

// @group Molecules
// The search including search results<br><br>
// **SASS-path:** _./styles/components/molecules/voyado-search.scss_
export default {
  name: 'VoyadoSearch',
  components: {
    // VoyadoSearchForm
  },
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
    // recentSearches: [],
    // topSearches: ['godis', 'askar', 'lakrits', 'choklad', 'present'],
    noResults: false
  }),
  computed: {
    setSearchPageUrl() {
      return (
        this.$getPath('index') +
        this.$config.routePaths.search +
        '/' +
        this.searchQuery
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
    // showRecentSearches() {
    //   return this.recentSearches.length;
    // },
    productsVisible() {
      return this.products.slice(0, this.resultsToShow);
    }
    // categoriesVisible() {
    //   let arr = [];
    //   this.products.forEach(item => {
    //     item.categories.forEach(cat => {
    //       arr.push(cat);
    //     });
    //   });
    //   const collectedArr = [];
    //   arr = arr.map(item => {
    //     const index = collectedArr.findIndex(i => i.name === item.name);
    //     if (index === -1) {
    //       const obj = {
    //         name: item.name,
    //         canonicalUrl: item.canonicalUrl,
    //         count: 1
    //       };
    //       collectedArr.push(obj);
    //     } else {
    //       collectedArr[index].count++;
    //     }
    //   });
    //   return collectedArr
    //     .sort((a, b) => b.count - a.count)
    //     .slice(0, this.resultsToShow);
    // },
    // brandsVisible() {
    //   let arr = [];
    //   this.products.forEach(item => {
    //     arr.push(item.brand);
    //   });
    //   const collectedArr = [];
    //   arr = arr.map(item => {
    //     const index = collectedArr.findIndex(i => i.name === item.name);
    //     if (index === -1) {
    //       const obj = {
    //         name: item.name,
    //         canonicalUrl: item.canonicalUrl,
    //         count: 1
    //       };
    //       collectedArr.push(obj);
    //     } else {
    //       collectedArr[index].count++;
    //     }
    //   });
    //   return collectedArr
    //     .sort((a, b) => b.count - a.count)
    //     .slice(0, this.resultsToShow);
    // }
  },
  watch: {
    primaryProductGroups(val) {
      console.log('voyado search primaryProductGroups changed', val);
    }
  },
  mounted() {
    this.searchStorage = window.localStorage;
    // this.recentSearches = this.searchStorage.getItem('recentSearches')
    //   ? JSON.parse(localStorage.getItem('recentSearches'))
    //   : [];
    eventbus.$on('route-change', () => {
      this.onClose();
    });
  },
  beforeDestroy() {
    eventbus.$off('route-change');
  },
  methods: {
    // setRecentSearch() {
    //   if (this.searchQuery === '') {
    //     return;
    //   }
    //   if (this.recentSearches.includes(this.searchQuery)) {
    //     this.recentSearches.splice(
    //       this.recentSearches.indexOf(this.searchQuery),
    //       1
    //     );
    //     this.recentSearches.unshift(this.searchQuery);
    //   } else {
    //     this.recentSearches.unshift(this.searchQuery);
    //     if (this.recentSearches.length > 5) {
    //       this.recentSearches.pop();
    //     }
    //   }
    //   this.searchStorage.setItem(
    //     'recentSearches',
    //     JSON.stringify(this.recentSearches)
    //   );
    // },
    // @vuese
    // Perform search
    onSearchInput(results) {
      console.log('VoyadoSearch: onSearchInput', results);
      this.isLoading = results.isLoading;
      this.noResults = results.noResults;
      this.searchQuery = results.searchQuery;
    },
    onBlur(event) {
      this.$nextTick(() => {
        if (this.searchQuery === '') {
          this.onClose();
        }
      });
    },
    onEnter() {
      if (this.searchQuery.length) {
        console.log('VoyadoSearch: onEnter', this.searchQuery.length);
        // this.setRecentSearch();
        this.$router.push(this.setSearchPageUrl);
        this.$emit('voyadoSearchOnRouteChange');
        this.onClose();
      }
    },
    // setSearchQuery(string) {
    //   this.searchQuery = string;
    //   this.fetchResults();
    // },
    onClose() {
      // if (this.hasProductResults) {
      //   this.setRecentSearch();
      // }
      document.body.style.overflow = null;
      this.noResults = false;
      this.isActive = false;
      this.searchQuery = '';
      this.products = [];
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
