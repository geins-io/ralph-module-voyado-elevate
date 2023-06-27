<template>
  <LazyCaContentPanel
    name="filters"
    enter-from="right"
    :title="$t('FILTER_SORT')"
    class="ca-filter-panel"
  >
    <LazyCaAccordionItem
      v-if="showSortAtTop"
      class="ca-filter-panel__toggle"
      :styled="false"
    >
      <template #toggle-text>
        <span class="ca-filter-panel__toggle-text">
          {{ $t('SORT_TITLE') }}
        </span>
      </template>
      <ul class="ca-filter-panel__sort">
        <li
          v-for="(sort, index) in sortOptions"
          :key="index"
          class="ca-filter-panel__sort-item"
        >
          <button
            type="button"
            class="ca-filter-panel__sort-button"
            :class="{
              'ca-filter-panel__sort-button--current':
                sort.value === currentSort
            }"
            @click="updateSort(sort.value)"
          >
            {{ sort.label }}
          </button>
        </li>
      </ul>
    </LazyCaAccordionItem>
    <LazyCaAccordionItem
      v-for="(facet, index) in facetsWithValues"
      :key="index"
      class="ca-filter-panel__toggle"
      :styled="false"
    >
      <template #toggle-text>
        <div class="ca-filter-panel__toggle-content">
          <span class="ca-filter-panel__toggle-text">
            {{ facet.label }}
          </span>
          <CaNotificationBadge
            :number="facet.selectedCount"
            :positioned="false"
          />
        </div>
      </template>
      <VoyadoFilterMulti
        :values="facet.values"
        @selection="setSelection(facet.id, $event)"
      />
    </LazyCaAccordionItem>
    <LazyCaAccordionItem
      v-if="!showSortAtTop"
      class="ca-filter-panel__toggle"
      :styled="false"
    >
      <template #toggle-text>
        <span class="ca-filter-panel__toggle-text">
          {{ $t('SORT_TITLE') }}
        </span>
      </template>
      <ul class="ca-filter-panel__sort">
        <li
          v-for="(sort, index) in sortOptions"
          :key="index"
          class="ca-filter-panel__sort-item"
        >
          <button
            type="button"
            class="ca-filter-panel__sort-button"
            :class="{
              'ca-filter-panel__sort-button--current':
                sort.value === currentSort
            }"
            @click="updateSort(sort.value)"
          >
            {{ sort.label }}
          </button>
        </li>
      </ul>
    </LazyCaAccordionItem>
    <template #footer>
      <div class="ca-filter-panel__footer">
        <div class="ca-filter-panel__buttons-wrap">
          <CaButton
            class="ca-filter-panel__button-reset"
            color="secondary"
            :disabled="!hasSelection"
            :size="buttonSize"
            type="full-width"
            @clicked="resetFilters"
          >
            {{ $t('RESET_FILTER') }}
          </CaButton>
          <CaButton
            class="ca-filter-panel__button-apply"
            :size="buttonSize"
            type="full-width"
            @clicked="closeContentPanel"
          >
            {{ $t('APPLY_FILTER') }}
          </CaButton>
        </div>
      </div>
    </template>
  </LazyCaContentPanel>
</template>
<script>
import { mapState } from 'vuex';
import eventbus from '@ralph/ralph-ui/plugins/eventbus.js';
import MixProductListSort from 'MixProductListSort';

export default {
  name: 'VoyadoFilterPanel',
  mixins: [MixProductListSort],
  props: {
    externalSortOptions: {
      type: Array,
      required: true
    },
    currentSort: {
      type: String,
      required: true
    },
    facets: {
      type: Array,
      required: true
    },
    showSortAtTop: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({}),
  computed: {
    buttonSize() {
      return this.$store.getters.viewport === 'phone' ? 's' : 'm';
    },
    sortOptions() {
      return this.externalSortOptions.map(sort => ({
        label: sort.label,
        value: sort.id
      }));
    },
    facetsWithValues() {
      this.facets.map(facet => {
        if (facet.type === 'SIZE') {
          facet.values = facet.sizeTypes[0].formats.flatMap(f => f.values);
        }
        return facet;
      });
      return this.facets.filter(facet => facet.values?.length > 0);
    },
    hasSelection() {
      return this.facets.some(facet => facet.selectedCount > 0);
    },
    ...mapState(['contentpanel'])
  },
  watch: {},
  mounted() {},
  methods: {
    resetFilters() {
      this.closeContentPanel();
      this.$emit('reset');
    },
    closeContentPanel() {
      eventbus.$emit('close-content-panel');
    },
    updateSort(sort) {
      this.$emit('sortchange', sort);
      this.closeContentPanel();
    },
    setSelection(facetId, values) {
      this.$emit('selectionchange', { facetId, values });
    }
  }
};
</script>
<style lang="scss">
@import 'organisms/ca-filter-panel';
</style>
