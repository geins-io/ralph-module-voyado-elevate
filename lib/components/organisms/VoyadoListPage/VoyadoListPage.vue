<template>
  <div class="voyado-list-page">
    <CaContainer>
      <CaBreadcrumbs v-if="listInfo" :current="breadcrumbsCurrent" />
      <CaSkeleton v-else class="ca-breadcrumbs" width="10%" />
      <CaListTop :type="type" :list-info="listInfo" />
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
        :products="productList"
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
      :facets="facets"
      @sortchange="sortChangeHandler"
      @selectionchange="selectionChangeHandler"
    />
  </div>
</template>
<script>
import { mapState } from 'vuex';
// The voyado search page<br><br>
export default {
  name: 'VoyadoListPage',
  props: {
    type: {
      type: String,
      default: 'list',
      validator(value) {
        return ['list', 'search'].includes(value);
      }
    },
    query: {
      type: String,
      default() {
        return this.$route.params.search;
      }
    },
    pageReference: {
      type: String,
      default() {
        return decodeURI(this.$route.path);
      }
    },
    pageSize: {
      type: Number,
      default() {
        return this.$config.productListPageSize;
      }
    },
    listInfo: {
      type: Object,
      required: true
    },
    defaultSort: {
      type: String,
      default: 'RELEVANCE'
    }
  },
  data: () => ({
    productList: [],
    isLoading: true,
    page: 1,
    totalCount: 0,
    sort: '',
    sortOptions: [],
    facets: [],
    updatingFromURL: true,
    currentMaxCount: 0,
    currentMinCount: 0,
    facetsSelection: {}
  }),
  computed: {
    isSearch() {
      return this.type === 'search';
    },
    isList() {
      return this.type === 'list';
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
    breadcrumbsCurrent() {
      const currentAlias = this.isList
        ? this.pageReference.split('/').pop()
        : this.query;
      return this.listInfo
        ? {
            name: this.listInfo.name,
            alias: currentAlias,
            canonical: this.listInfo.canonicalUrl,
            id: this.listInfo.id,
            type: this.type
          }
        : {};
    },
    facetsQueryString() {
      let string = '';
      Object.keys(this.facetsSelection).forEach(key => {
        if (this.facetsSelection[key].length > 0) {
          string += `&f.${key}=${this.facetsSelection[key].join('|')}`;
        }
      });

      return string.substring(1);
    },
    facetsQueryObject() {
      const queryObject = {};
      Object.keys(this.facetsSelection).forEach(key => {
        if (this.facetsSelection[key].length > 0) {
          queryObject[`f.${key}`] = this.facetsSelection[key].join('|');
        }
      });

      return queryObject;
    },
    ...mapState(['voyado', 'list'])
  },
  mounted() {
    if (!this.voyado.api) {
      this.$store.dispatch('initVoyado');
    }
    this.initList();
  },
  methods: {
    initList() {
      this.sort = this.defaultSort;
      this.page = this.list.relocatePage || 1;
      this.readURLParams();
      this.fetchListPage(true);
    },
    async fetchListPage(
      setMinCount = false,
      resetList = false,
      isPrev = false
    ) {
      try {
        let data = null;
        const apiQuery = {
          limit: this.pageSize,
          skip: this.skip,
          presentCustom: 'ralph_data|ralph_data_skus',
          sort: this.sort,
          ...this.facetsQueryObject
        };

        if (this.isSearch) {
          const query = {
            ...apiQuery,
            q: this.query,
            origin: this.voyado.searchOrigin
          };

          data = await this.voyado.api.query.searchPage(query);
          this.$store.commit('setSearchOrigin');
        } else {
          const query = {
            ...apiQuery,
            pageReference: this.pageReference
          };

          data = await this.voyado.api.query.landingPage(query, {
            primaryList: {
              include: true,
              productRules: 'rule excl custom.price_type { "SALE_PRICE" }'
            }
          });
        }
        this.updatingFromURL = false;

        const products = data?.primaryList?.productGroups;
        const newList = await this.$store.dispatch(
          'transformProducts',
          products
        );

        if (isPrev) {
          this.productList = [...newList, ...this.productList];
        } else {
          this.productList = resetList
            ? newList
            : [...this.productList, ...newList];
        }

        this.totalCount = data?.primaryList?.totalHits;
        this.sortOptions = data?.primaryList?.sort.options;
        this.facets = data?.primaryList?.facets;

        const count = this.skip + this.pageSize;
        this.currentMaxCount =
          count >= this.totalCount ? this.totalCount : count;

        if (setMinCount) {
          this.currentMinCount = this.skip + 1;
        }

        this.pushURLParams();
      } catch (err) {
        this.$nuxt.error({ statusCode: err.statusCode, message: err });
      } finally {
        this.isLoading = false;
        this.$store.dispatch('loading/end');
      }
    },
    loadMore() {
      this.isLoading = true;
      this.page++;
      this.fetchListPage();
    },
    loadPrev() {
      this.isLoading = true;
      this.page--;
      this.fetchListPage(true, false, true);
    },
    sortChangeHandler(sort) {
      if (!this.updatingFromURL) {
        this.sort = sort;
        this.page = 1;
        this.fetchListPage(true, true);
      }
    },
    selectionChangeHandler(data) {
      if (!this.updatingFromURL) {
        const values = data.values.filter(i => i.selected).map(i => i.id);
        this.$set(this.facetsSelection, data.facetId, values);
        this.page = 1;
        this.fetchListPage(true, true);
      }
    },
    pushURLParams() {
      const params = {
        sort: this.sort,
        page: this.page,
        facets: this.facetsQueryString
      };
      if (params.sort === this.defaultSort) {
        delete params.sort;
      }
      if (params.page === 1) {
        delete params.page;
      }
      if (params.facets === '') {
        delete params.facets;
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
      if (params.facets) {
        const facets = decodeURI(params.facets).split('&');
        facets.forEach(facet => {
          const [key, value] = facet.split('=');
          const facetId = key.split('.')[1];
          const values = value.split('|');
          this.$set(this.facetsSelection, facetId, values);
        });
      }
    }
  }
};
</script>
