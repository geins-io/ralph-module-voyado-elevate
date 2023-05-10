<template>
  <div class="voyado-search-page">
    <CaContainer>
      <CaListTop type="search" :list-info="listInfo" />
      <div class="ca-list-page__filters">
        <div class="ca-list-settings">
          <div class="ca-list-settings__active-products">
            {{ totalCount }}
            {{ $tc('PRODUCT_LOWERCASE', totalCount) }}
          </div>

          <CaClickable
            class="ca-list-settings__filter-toggle"
            @clicked="
              $store.commit('contentpanel/open', {
                name: 'filters',
                frame: 'sort'
              })
            "
          >
            <CaIconAndText
              class="ca-list-settings__icon-text"
              icon-name="filter"
              icon-position="right"
              base-element="div"
            >
              <div class="ca-list-settings__filter-button-wrap">
                {{ $t('FILTER_SORT') }}
              </div>
            </CaIconAndText>
          </CaClickable>
        </div>
      </div>

      <CaListPagination
        v-if="currentMinCount > 1"
        direction="prev"
        :showing="showing"
        :total-count="totalCount"
        :min-count="currentMinCount"
        :max-count="currentMaxCount"
        :all-products-loaded="allProductsLoaded"
        :loading="isLoading"
        @loadprev="loadPrev"
      />

      <CaProductList
        :page-size="pageSize"
        :products="list"
        :products-fetched="!isLoading"
      />

      <CaListPagination
        direction="next"
        :showing="showing"
        :total-count="totalCount"
        :min-count="currentMinCount"
        :max-count="currentMaxCount"
        :all-products-loaded="allProductsLoaded"
        :loading="isLoading"
        @loadmore="loadMore"
      />
    </CaContainer>
    <LazyVoyadoFilterPanel
      :external-sort-options="sortOptions"
      :current-sort="sort"
      @sortchange="sortChangeHandler"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex';
// The voyado search page<br><br>
export default {
  name: 'VoyadoSearchPage',
  props: {
    query: {
      type: String,
      required: true
    },
    pageSize: {
      type: Number,
      default() {
        return this.$config.productListPageSize;
      }
    }
  },
  data: () => ({
    list: [],
    isLoading: true,
    page: 1,
    totalCount: 0,
    sort: 'RELEVANCE',
    sortOptions: [],
    updatingFromURL: true,
    currentMaxCount: 0,
    currentMinCount: 0
  }),
  computed: {
    listInfo() {
      return {
        name: this.$t('VOYADO_SEARCH_PAGE_TITLE', {
          search: this.query
        })
      };
    },
    skip() {
      return (this.page - 1) * this.pageSize;
    },
    showing() {
      return this.currentMinCount + ' - ' + this.currentMaxCount;
    },
    allProductsLoaded() {
      return this.currentMaxCount >= this.totalCount;
    },
    ...mapState(['voyado'])
  },
  mounted() {
    this.readURLParams();
  },
  methods: {
    async fetchSearchPage(
      setMinCount = false,
      resetList = false,
      isPrev = false
    ) {
      try {
        const data = await this.voyado.api.query.searchPage({
          q: this.query,
          limit: this.pageSize,
          skip: this.skip,
          presentCustom: 'ralph_data|ralph_data_skus',
          sort: this.sort
        });

        this.updatingFromURL = false;

        const products = data?.primaryList?.productGroups;
        const newList = await this.$store.dispatch(
          'transformProducts',
          products
        );

        if (isPrev) {
          this.list = [...newList, ...this.list];
        } else {
          this.list = resetList ? newList : [...this.list, ...newList];
        }

        this.totalCount = data?.primaryList?.totalHits;
        this.sortOptions = data?.primaryList?.sort.options;

        const count = this.skip + this.pageSize;
        this.currentMaxCount =
          count >= this.totalCount ? this.totalCount : count;

        if (setMinCount) {
          this.currentMinCount = this.skip + 1;
        }

        this.pushURLParams();
      } catch (error) {
        this.$nuxt.error({ statusCode: error.statusCode, message: error });
      } finally {
        this.isLoading = false;
        this.$store.dispatch('loading/end');
      }
    },
    loadMore() {
      this.isLoading = true;
      this.page++;
      this.fetchSearchPage();
    },
    loadPrev() {
      this.isLoading = true;
      this.page--;
      this.fetchSearchPage(true, false, true);
    },
    sortChangeHandler(sort) {
      if (!this.updatingFromURL) {
        this.sort = sort;
        this.page = 1;
        this.fetchSearchPage(true, true);
      }
    },
    pushURLParams() {
      const params = {
        sort: this.sort,
        page: this.page
      };
      if (params.sort === 'RELEVANCE') {
        delete params.sort;
      }
      if (params.page === 1) {
        delete params.page;
      }

      this.$router
        .replace({
          query: params
        })
        .catch(() => {});
    },
    readURLParams() {
      const params = this.$route.query;

      if (params.sort) {
        this.sort = params.sort;
      }
      if (params.page) {
        this.page = Number(params.page);
      }

      this.fetchSearchPage(true);
    }
  }
};
</script>
