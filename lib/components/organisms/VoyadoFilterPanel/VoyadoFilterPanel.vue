<template>
  <LazyCaContentPanel
    name="filters"
    enter-from="right"
    :title="$t('FILTER_SORT')"
    class="ca-filter-panel"
  >
    <LazyCaAccordionItem
      class="ca-filter-panel__toggle"
      :open-on-init="contentpanel.frame === 'sort'"
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
            :disabled="true"
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
    }
  },
  data: () => ({
    currentSelection: {}
  }),
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
    ...mapState(['contentpanel'])
  },
  watch: {
    selection(newVal) {
      this.currentSelection = newVal;
    }
  },
  mounted() {
    this.currentSelection = this.selection;
  },
  methods: {
    resetFilters() {
      this.$emit('reset');
    },
    closeContentPanel() {
      eventbus.$emit('close-content-panel');
    },
    updateSelection(selection, type, group = null) {
      if (group) {
        const obj = this.currentSelection.parameters;
        if (obj[group]) {
          obj[group] = selection;
        } else {
          this.$set(obj, group, selection);
        }
        this.$set(this.currentSelection, 'parameters', obj);
      } else {
        this.currentSelection[type] = selection;
      }
      this.$emit('selectionchange', this.currentSelection);
    },
    getParameterSelection(group) {
      const selection = this.selection.parameters[group];
      return selection || [];
    },
    updateSort(sort) {
      this.$emit('sortchange', sort);
      this.closeContentPanel();
    }
  }
};
</script>
<style lang="scss">
@import 'organisms/ca-filter-panel';
</style>
