<template>
  <div class="voyado-search__wrapper">
    <div class="voyado-search__bar">
      <div class="voyado-search__input-wrap">
        <input
          v-model="searchTerm"
          class="voyado-search__input"
          type="search"
          autocomplete="off"
          :aria-label="$t('VOYADO_SEARCH')"
          :placeholder="$t('VOYADO_SEARCH_PLACEHOLDER')"
          @input="handleSearchInput"
          @focus="open"
          @blur="blurHandler"
          @keyup.enter="goToSearchPage"
        />
        <!-- <CaIconButton
          v-if="searchTerm"
          class="voyado-search__remove"
          icon-name="x"
          aria-label="Delete"
          @clicked="close"
        /> -->
        <!-- <CaIconButton
          class="voyado-search__button"
          icon-name="search"
          :aria-label="$t('SEARCH')"
          @clicked="goToSearchPage"
        /> -->
      </div>
    </div>
    <div class="voyado-search" :modifiers="modifiers">
      <h2 class="voyado-search__title">
        Voyado Elevate
      </h2>
      <input v-model="searchTerm" type="text" placeholder="Search...">
      <div v-if="searchTerm && searchResults" class="voyado-search__results">
        <h3 class="voyado-search__result-label">
          Results
        </h3>
        <ul v-if="primaryProductGroups.length">
          <li
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
              >
                <div class="voyado-search__product">
                  <div class="voyado-search__product-image">
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
                  <div class="voyado-search__product-info">
                    <div class="voyado-search__product-name">
                      {{ product.title }}
                    </div>
                    <div class="voyado-search__product-price">
                      {{ product.sellingPrice }}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { esales } from '@apptus/esales-api';

export default {
  name: 'VoyadoSearch',
  data() {
    return {
      error: null,
      searchTerm: '',
      searchResults: [],
      primaryProductGroups: [],
      typingTimeout: null,
      isLoading: false,
      isActive: false,
      // noResults: false
    };
  },
  computed: {
    modifiers() {
      return {
        'voyado-search--active': this.isActive
      };
    },
    hasProducts() {
      return this.primaryProductGroups.length;
    },
  },
  watch: {
    searchTerm: {
      handler: 'handleSearchInput',
      immediate: false,
    },
  },
  methods: {
    // Create esales api instance
    esalesApi() {
      return esales({
        market: 'SE',
        locale: 'sv-SE',
        clusterId: 'wAFAF8CF4',
        touchpoint: 'desktop',
      });
    },
    // Handle search input
    handleSearchInput() {
      this.isLoading = true;
      // this.noResults = false;
      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(this.doSearch, 500);
    },
    // Perform search
    async doSearch() {
      try {
        const results = await this.esalesApi().query.searchPage({
          q: this.searchTerm,
          limit: 60
        });
        this.searchResults = results;

        if (results?.primaryList?.productGroups?.length) {
          this.primaryProductGroups = results.primaryList.productGroups;
          console.log('voyado: primaryProductGroups', this.primaryProductGroups);
        }

        console.log('voyado: results', results);
      } catch (error) {
        this.error = error;
        console.log('voyado: error', error);
      } finally {
        this.isLoading = false;
      }
    },
    // Search is open
    open() {
      if (!this.isActive) {
        this.isActive = true;
        // this.$store.dispatch('setViewportHeight');
        // this.$store.dispatch('setScrollbarWidth');
        document.body.style.overflow = 'hidden';
      }
    },
    close() {
      // if (this.hasProducts) {
      //   this.setRecentSearch();
      // }
      document.body.style.overflow = null;
      // this.noResults = false;
      this.isActive = false;
      this.searchTerm = '';
      this.primaryProductGroups = [];
      this.$emit('closed');
    },
    async blurHandler() {
      await this.$nextTick();

      if (this.searchTerm === '') {
        this.close();
      }
    },
    goToSearchPage() {
      if (this.searchTerm) {
        // this.setRecentSearch();
        // this.$router.push(this.setSearchLink);
        this.$emit('searchRouteChange');
        this.close();
      }
    },
  },
};
</script>
<style lang="scss">
// @import 'molecules/voyado-search';
</style>
