<template>
  <div class="voyado-search__wrapper">
    <div ref="search" class="voyado-search" :class="modifiers">
      <div class="voyado-search__bar">
        <div class="voyado-search__input-wrap">
          <input
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
          />
          <CaIconButton
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
          />
        </div>
      </div>
      <!-- <div
        v-if="!loading && active && !hasProductResults && !noResults"
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
              @mousedown="setsearchQuery(search)"
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
        v-else-if="active && !hasProductResults"
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
          loading ||
            (noResults && searchIsVisible) ||
            (hasProductResults && searchIsVisible)
        "
        class="voyado-search__results"
        :class="{
          'voyado-search__results--loading': loading,
          'voyado-search__results--loading-empty': loading && !hasProductResults,
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
              :loading="loading"
            />
            <div v-if="noResults && !loading" class="voyado-search__no-results">
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
          @click="close"
        >
          <CaIconAndText icon-name="x">{{ $t('CLOSE') }}</CaIconAndText>
        </button>
      </section>
    </div>
    <CaOverlay class="voyado-search__overlay" :visible="active" @clicked="close" />
  </div>
</template>
<script>
// import searchQuery from 'global/search.graphql';
import eventbus from 'ralph-module-voyado-elevate/lib/eventBus';
import { esales } from '@apptus/esales-api';

// @group Molecules
// The search including search results<br><br>
// **SASS-path:** _./styles/components/molecules/voyado-search.scss_
export default {
  name: 'VoyadoSearch',
  mixins: [],
  props: {
    // Used to toogle search in mobile, set to true when user opens it
    opened: {
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
    typingTimeout: null,
    loading: false,
    active: false,
    products: [],
    primaryProductGroups: [],
    totalResults: 0,
    searchStorage: null,
    // recentSearches: [],
    // topSearches: ['godis', 'askar', 'lakrits', 'choklad', 'present'],
    noResults: false
  }),
  computed: {
    setSearchPageLink() {
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
        'voyado-search--active': this.active
      };
    },
    // showRecentSearches() {
    //   return this.recentSearches.length;
    // },
    productsVisible() {
      return this.products.slice(0, this.resultsToShow);
    },
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
    },
  },
  mounted() {
    this.searchStorage = window.localStorage;
    // this.recentSearches = this.searchStorage.getItem('recentSearches')
    //   ? JSON.parse(localStorage.getItem('recentSearches'))
    //   : [];
    eventbus.$on('route-change', () => {
      this.close();
    });
  },
  beforeDestroy() {
    eventbus.$off('route-change');
  },
  methods: {
    esalesApi() {
      return esales({
        market: 'SE',
        locale: 'sv-SE',
        clusterId: 'wAFAF8CF4',
        touchpoint: 'desktop',
      });
    },
    // @vuese
    // Perform search
    handleSearchInput() {
      this.loading = true;
      this.noResults = false;
      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(this.fetchResults, 500);
    },
    async fetchResults() {
      this.loading = true;

      if (this.searchQuery !== '') {
        try {
          const results = await this.esalesApi().query.searchPage({
            q: this.searchQuery,
            limit: 60
          });
          this.searchResults = results;

          if (results?.primaryList?.productGroups?.length) {
            this.primaryProductGroups = results?.primaryList?.productGroups || [];
            this.products = this.getAllProducts();
            console.log('voyado: primaryProductGroups', this.primaryProductGroups);
          }

          if (this.hasProductResults) {
            this.totalResults = this.searchResults.primaryList.totalHits;
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
    blurHandler(event) {
      this.$nextTick(() => {
        if (this.searchQuery === '') {
          this.close();
        }
      });
    },
    setsearchQuery(string) {
      this.searchQuery = string;
      this.fetchResults();
    },
    goToSearchPage() {
      if (this.searchQuery) {
        // this.setRecentSearch();
        this.$router.push(this.setSearchPageLink);
        this.$emit('searchRouteChange');
        this.close();
      }
    },
    close() {
      // if (this.hasProductResults) {
      //   this.setRecentSearch();
      // }
      document.body.style.overflow = null;
      this.noResults = false;
      this.active = false;
      this.searchQuery = '';
      this.products = [];
      this.$emit('closed');
    },
    open() {
      if (!this.active) {
        this.active = true;
        this.$store.dispatch('setViewportHeight');
        this.$store.dispatch('setScrollbarWidth');
        document.body.style.overflow = 'hidden';
      }
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
  }
};
</script>
<style lang="scss">
// @import 'molecules/voyado-search';
</style>
