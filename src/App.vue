<template>
  <div ref="container" :class="$style.container">
    <div ref="mtTable" :class="$style.mpTable" @wheel="onWheel">
      <net.group.top />
      <net.group.bottom />
      <net.period.left />
      <net.period.right />

      <ChemicalElement
        v-for="element in elements"
        :key="element.atomicNumber"
        :element="element"
        :isSelected="element.atomicNumber === selected?.atomicNumber"
        @click="selectChemicalElement($event)"
      />

      <lines />
    </div>

    <ChemicalElementCard
      v-if="selected"
      :key="selected.chemicalSymbol"
      :class="$style.card"
      :element="selected"
      @close="closeCard"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, useCssModule } from 'vue';

import type { ChemicalElement as ChemicalElementType } from '@/types';
import { elements } from '@/periodic-elements';

import { useLines } from '@/composables/useLines';
import { useDraggingScroll } from '@/composables/useDraggingScroll';
import { useInvertWheelBehaviour } from '@/composables/useInvertWheelBehaviour';
import { useResizeObserver } from '@/composables/useResizeObserver';
import { usePeriodicNet } from '@/composables/usePeriodicNet';
import { useScrollTo } from '@/composables/useScrollTo';

import ChemicalElement from '@/components/ChemicalElement.vue';
import ChemicalElementCard from '@/components/ChemicalElementCard.vue';

const container = ref<HTMLDivElement | null>(null);
const mtTable = ref<HTMLDivElement | null>(null);
const selectedEl = ref<HTMLDivElement | null>(null);

const selected = ref<ChemicalElementType | null>(null);

const style = useCssModule();
// const { onMouseDown, onMouseMove, onMouseUp } = useDraggingScroll(mtTable);
const { onWheel } = useInvertWheelBehaviour(mtTable);
const { lines, setLines, hideLines } = useLines(style);
const { net } = usePeriodicNet(elements, selected, style);
const { scrollTo } = useScrollTo(mtTable);

function selectChemicalElement(value: { element: ChemicalElementType; el: HTMLDivElement | null }) {
  if (selected.value?.atomicNumber === value.element.atomicNumber) return closeCard();

  selected.value = value.element;
  selectedEl.value = value.el;
  if (value.el) {
    setLines(value.el);
    scrollTo(value.el);
  }
}

function closeCard() {
  selected.value = null;
  selectedEl.value = null;
  hideLines();
}

useResizeObserver(container, () => {
  if (!selectedEl.value) return;
  setLines(selectedEl.value);
});
</script>

<style module lang="scss">
.container {
  display: flex;
  padding: 0 24px 24px 24px;
}

.mpTable {
  flex: 1 1 100%;
  overflow-x: scroll;
  position: relative;
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  grid-auto-flow: row;
  z-index: 1;
  padding-top: 24px;

  &::-webkit-scrollbar {
    display: none;
  }

  .netNumber {
    height: 100%;
    text-align: center;
    opacity: 0.3;

    &.selected {
      opacity: 1;
    }

    &.top {
      justify-self: center;
      align-content: end;
      padding-bottom: 8px;
    }

    &.bottom {
      justify-self: center;
      align-content: start;
      padding-top: 8px;
    }

    &.left {
      align-content: center;
      justify-items: end;
      padding-right: 8px;
    }

    &.right {
      align-content: center;
      justify-items: start;
      padding-left: 8px;
    }

    .text {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4px;
      border: 1px solid var(--text-color);
      border-radius: 50%;
      width: 24px;
      height: 24px;
    }
  }

  .line {
    position: absolute;
    z-index: -2;

    &.vertical {
      --gradient: 0%;
      background: linear-gradient(to bottom, var(--bg-color) 0%, #a1a1a1 var(--gradient), var(--bg-color) 100%);
      top: 0;
      width: 1px;
      height: 100%;
    }

    &.horizontal {
      --gradient: 0%;
      background: linear-gradient(to right, var(--bg-color) 0%, #a1a1a1 var(--gradient), var(--bg-color) 100%);
      left: 0;
      // right: 0;
      width: 100%;
      height: 1px;
    }
  }
}

.card {
  flex: 0 0 auto;
}
</style>
