<template>
  <div class="ca-filter-multi">
    <ul class="ca-filter-multi__list">
      <li
        v-for="(value, index) in currentValues"
        :key="index"
        class="ca-filter-multi__value"
        :class="{
          'ca-filter-multi__value--selected': value.selected,
          'ca-filter-multi__value--color': value.color
        }"
        @click="toggleSelection(value)"
      >
        <CaIcon class="ca-filter-multi__check" name="check" />
        <CaColorIcon
          v-if="value.color"
          class="ca-filter-multi__color"
          :hex-color="value.color.substring(1)"
        />
        <span class="ca-filter-multi__label">{{ value.label }}</span>
        <span class="ca-filter-multi__count">{{ value.count }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'VoyadoFilterMulti',
  mixins: [],
  props: {
    values: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    currentValues: []
  }),
  computed: {},
  watch: {
    values: {
      handler(newVal) {
        this.currentValues = newVal;

        let hasNoCount = false;
        this.currentValues.forEach(value => {
          if (!value.count) {
            this.$set(value, 'selected', false);
            hasNoCount = true;
          }
        });
        if (hasNoCount) {
          this.currentValues = [...this.currentValues];
          this.$emit('selection', this.currentValues);
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {},
  methods: {
    toggleSelection(value) {
      value.selected = !value.selected;
      this.currentValues = [...this.currentValues];
      this.$emit('selection', this.currentValues);
    }
  }
};
</script>
<style lang="scss">
@import 'molecules/ca-filter-multi';
</style>
