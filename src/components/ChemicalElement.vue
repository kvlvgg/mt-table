<template>
  <div
    ref="el"
    :key="element.atomicNumber"
    :class="chemicalElementClasses"
    :style="chemicalElementStyle"
    @click="$emit('click', { element, el })"
  >
    <Text :class="$style.atomicNumber" font="medium" size="xs">{{ element.atomicNumber }}</Text>
    <Text font="regular" size="xl">{{ element.chemicalSymbol }}</Text>
    <Text font="medium" size="xs">{{ element.atomicMass }}</Text>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useCssModule, type PropType } from 'vue';

import type { ChemicalElement } from '@/types';
import Text from '@/components/Text.vue';

defineEmits<{ click: [value: { element: ChemicalElement; el: HTMLDivElement | null }] }>();

const props = defineProps({
  element: { type: Object as PropType<ChemicalElement>, required: true },
  isSelected: { type: Boolean, default: false },
});

const el = ref<HTMLDivElement | null>(null);
const style = useCssModule();

const chemicalElementClasses = computed(() => ({
  [style.chemicalElement]: true,
  [style.selected]: props.isSelected,
}));

const chemicalElementStyle = computed(() => ({
  gridColumn: `${props.element.group + 1}`,
  '--chemical-element-color': `var(--${props.element.type})`,
}));
</script>

<style module lang="scss">
@use '@/assets/scss/fonts.scss' as *;

.chemicalElement {
  min-width: 72px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 0;
  border: 1px solid transparent;
  user-select: none;

  cursor: pointer;
  box-shadow: 0px 0px 1px 0px var(--text-color);
  --text-color: var(--chemical-element-color);

  .atomicNumber {
    padding: 0 16px;
    align-self: flex-end;
  }

  &.selected {
    --text-color: var(--bg-color) !important;
    background-color: rgb(from var(--chemical-element-color) r g b / 1);
  }

  &:hover:not(.selected) {
    background-color: rgb(from var(--chemical-element-color) r g b / 0.15);
  }
}
</style>
