import { mapState } from 'vuex';

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
    userSkip: 0,
    totalCount: 0,
    sort: '',
    sortOptions: [],
    facets: [],
    updatingFromURL: true,
    currentMaxCount: 0,
    currentMinCount: 0,
    facetsSelection: {},
    scrollHeight: 0,
    pushingUrlParams: false
  }),
  computed: {
    isSearch() {
      return this.type === 'search';
    },
    isList() {
      return this.type === 'list';
    },
    skip() {
      if (this.userSkip) {
        return this.userSkip;
      }
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
    facetsQuery() {
      const query = {};
      let queryString = '';

      Object.keys(this.facetsSelection).forEach(key => {
        if (this.facetsSelection[key].length > 0) {
          const facetValue = this.facetsSelection[key].join('|');
          query[`f.${key}`] = facetValue;
          queryString += `&f.${key}=${facetValue}`;
        }
      });

      return {
        obj: query,
        str: encodeURI(queryString.substring(1))
      };
    },
    ...mapState(['voyado', 'list'])
  },
  mounted() {
    if (!this.voyado.api) {
      this.$store.dispatch('initVoyado');
    }
    this.initList();
  },
  watch: {
    '$route.query': {
      handler(newQuery, oldQuery) {
        const newFacets = newQuery.facets;
        const oldFacets = oldQuery.facets;
        const newSort = newQuery.sort;
        const oldSort = oldQuery.sort;
        const newPage = newQuery.page;
        const oldPage = oldQuery.page;

        if (
          (newFacets !== oldFacets ||
            newSort !== oldSort ||
            newPage !== oldPage) &&
          !this.pushingUrlParams
        ) {
          this.updatingFromURL = true;
          this.resetHandler(false);
          this.$nextTick(() => {
            this.readURLParams();
            this.fetchListPage(true, true, false, false);
          });
        }
        this.pushingUrlParams = false;
      },
      deep: true
    }
  },
  methods: {
    initList() {
      this.sort = this.defaultSort;
      this.readURLParams();

      if (this.$store.getters['list/relocateProduct']) {
        this.page = this.list.relocatePage;
      }

      this.fetchListPage(true, false, false, false);
    },
    async fetchListPage(
      setMinCount = false,
      resetList = false,
      isPrev = false,
      pushParams = true
    ) {
      const skip = this.userSkip || this.skip;
      try {
        let data = null;
        const apiQuery = {
          limit: this.pageSize,
          skip,
          presentCustom:
            'ralph_data|ralph_data_skus|ralph_data_variant_dimensions|ralph_data_product_images',
          sort: this.sort,
          ...this.facetsQuery.obj
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

          data = await this.voyado.api.query.landingPage(query);
        }
        this.updatingFromURL = false;

        if (!data || !data.primaryList) {
          return;
        }

        const products = data.primaryList.productGroups;
        const newList = await this.$store.dispatch(
          'transformProducts',
          products
        );

        if (isPrev) {
          this.productList = [...newList, ...this.productList];
          this.$nextTick(() => {
            const scrollAmount = this.getScrollHeight() - this.scrollHeight;
            window.scrollBy(0, scrollAmount);
            this.scrollHeight = 0;
          });
        } else {
          this.productList = resetList
            ? newList
            : [...this.productList, ...newList];
        }

        this.totalCount = data.primaryList.totalHits;
        this.sortOptions = data.primaryList.sort.options;
        this.sort = data.primaryList.sort.selected;
        this.facets = data.primaryList.facets;

        if (setMinCount) {
          this.currentMinCount = skip + 1;
        }

        const count = this.currentMinCount - 1 + this.productList.length;

        this.currentMaxCount =
          count >= this.totalCount ? this.totalCount : count;

        if (this.productList.length === this.pageSize) {
          this.$nextTick(() => {
            this.relocateProduct();
          });
        }

        if (pushParams) {
          this.pushURLParams();
        }
      } catch (err) {
        this.$nuxt.error({ statusCode: err.statusCode, message: err });
      } finally {
        this.isLoading = false;
        this.$store.dispatch('loading/end');
      }
    },
    loadMore() {
      this.isLoading = true;
      this.page = this.currentMaxCount / this.pageSize + 1;
      this.userSkip = this.currentMaxCount;
      this.fetchListPage();
    },
    loadPrev() {
      this.isLoading = true;
      this.scrollHeight = this.getScrollHeight();
      this.page = (this.currentMinCount - 1) / this.pageSize;
      this.userSkip = this.currentMinCount - 1 - this.pageSize;
      this.fetchListPage(true, false, true);
    },
    sortChangeHandler(sort) {
      if (!this.updatingFromURL) {
        this.sort = sort;
        this.page = 1;
        this.userSkip = 0;
        this.fetchListPage(true, true);
      }
    },
    selectionChangeHandler(data) {
      if (!this.updatingFromURL) {
        const values = data.values.filter(i => i.selected).map(i => i.id);
        this.$set(this.facetsSelection, data.facetId, values);
        this.page = 1;
        this.userSkip = 0;
        this.fetchListPage(true, true);
      }
    },
    resetHandler(fetchData = true) {
      this.facetsSelection = {};
      this.page = 1;
      this.userSkip = 0;

      if (fetchData) {
        this.fetchListPage(true, true);
      }
    },
    pushURLParams() {
      const params = {
        sort: this.sort,
        page: this.page,
        facets: this.facetsQuery.str
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

      this.pushingUrlParams = true;
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
          const facetId = key.replace('f.', '');
          const values = value.split('|');
          this.$set(this.facetsSelection, facetId, values);
        });
      }
    },
    getScrollHeight() {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
    },
    relocateProduct() {
      if (!this.$store.getters['list/relocateProduct']) {
        return;
      }
      const product = document.querySelector(
        '[data-alias="' + this.list.relocateAlias + '"]'
      );
      if (product !== null) {
        this.$nextTick(() => {
          window.scroll(0, product.offsetTop);
          product.focus();
          this.$store.dispatch('list/resetTriggerRelocate');
        });
      }
      this.$store.commit('list/setBackNavigated', false);
      this.$store.commit('list/setRelocatePage', 1);
    }
  }
};
