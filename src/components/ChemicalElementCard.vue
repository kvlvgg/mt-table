<template>
  <div :class="$style.card">
    <div :class="$style.closeButtonContainer">
      <button :class="$style.closeButton" @click="$emit('close')">
        <img src="/icon-close.svg" alt="" />
      </button>
    </div>

    <div :class="$style.header">
      <div>
        <Text :class="$style.chemicalSymbol" font="extralight" size="x3l" block>{{ element.chemicalSymbol }} </Text>
        <Text font="regular" size="md" block>{{ data?.name.toUpperCase() }}</Text>
        <Text font="regular" size="md" block>{{ element.atomicMass }}</Text>
      </div>

      <div :class="$style.energyLevels">
        <Text font="regular" size="md" block>{{ element.atomicNumber }}</Text>

        <Text v-for="(lvl, i) in data?.energyLevels ?? []" :key="i" font="regular" size="xs" block>
          {{ lvl }}
        </Text>
      </div>
    </div>

    <Text :class="$style.description" font="extralight" size="md" block>
      {{ data?.description }}
    </Text>

    <div
      :style="{ '--properties-height': propertiesHeight }"
      :class="{ [$style.collapsable]: true, [$style.collapsed]: isPropertiesCollapsed }"
    >
      <div :class="$style.header">
        <button :class="$style.moreButton" @click="collapseProperties">
          <Text font="regular" size="sm" block>Read more ...</Text>
        </button>
      </div>

      <div ref="propertiesEl" :class="$style.properties">
        <div v-for="prop in properties" :class="$style.property">
          <Text font="extralight" size="sm" block>{{ prop.name }} </Text>
          <Text font="regular" size="sm" block>{{ prop.value }} </Text>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, type PropType, computed } from 'vue';

import type { ChemicalElement } from '@/types';
import Text from '@/components/Text.vue';

type ElementData = {
  name: string;
  symbol: string;
  atomicNumber: string;
  period: number;
  group: string;

  description: string;

  atomicMass: string;
  energyLevels: number[];
  electronConfiguration: string;
  densityRT: string;
  densityLiquidAtMP: string;
  meltingPointC: string;
  boilingPointC: string;
  molarHeatCapacity: string;
  molarVolume: string;
};

defineEmits<{ close: [value: void] }>();

const props = defineProps({
  element: { type: Object as PropType<ChemicalElement>, required: true },
});

const data = ref<ElementData | null>(null);
const properties = computed(() => [
  { name: 'Atomic mass', value: data.value?.atomicMass },
  { name: 'Electron conf.', value: data.value?.electronConfiguration /* '[Rn] 5f 6d 7s 7p' */ },
  { name: 'Density [near r.t.]', value: data.value?.densityRT /* '7.1-7.3 g cm' */ },
  { name: 'Liquid density at m.p.', value: data.value?.densityLiquidAtMP /* '1584 g cm' */ },
  { name: 'Melting point', value: data.value?.meltingPointC /* '650 C' */ },
  { name: 'Boiling point', value: data.value?.boilingPointC /* '1107 C' */ },
  { name: 'Molar heat capacity', value: data.value?.molarHeatCapacity },
  { name: 'Molar volume', value: data.value?.molarVolume },
]);

const propertiesEl = ref<HTMLDivElement | null>(null);
const propertiesHeight = ref('0px');
const isPropertiesCollapsed = ref(false);

function collapseProperties() {
  if (!propertiesEl.value) return;

  const { height } = getComputedStyle(propertiesEl.value);
  propertiesHeight.value = `${height}`;
  isPropertiesCollapsed.value = !isPropertiesCollapsed.value;
}

function retrieveData() {
  const path = `./p-elements/[Element.${props.element.chemicalSymbol}].json`;
  fetch(path)
    .then(x => x.json())
    .then(x => (data.value = x))
    .catch(() => (data.value = null));
}

onMounted(retrieveData);
</script>

<style module lang="scss">
@use '@/assets/scss/breakpoints' as *;

.card {
  position: relative;
  width: 320px;
  padding: 0 0 0 24px;
  overflow: hidden;

  background-image: url('/atom.svg');
  background-size: auto 32%;
  background-repeat: no-repeat;
  background-position: top -10px right -10px;

  @include breakpoint-down-md {
    margin-top: 24px;
    width: 100%;
    height: 100svh;
    padding: 24px;
  }

  .closeButtonContainer {
    height: 60px;
    display: flex;
    align-items: center;

    .closeButton {
      outline: none;
      background-color: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid var(--text-color);
      border-radius: 50%;
      width: 24px;
      height: 24px;
      cursor: pointer;

      img {
        width: 12px;
        height: 12px;
      }
    }
  }

  .header {
    display: flex;
    justify-content: space-between;

    .chemicalSymbol {
      margin-bottom: 12px;
    }

    .energyLevels {
      display: flex;
      flex-direction: column;
      text-align: right;
    }
  }

  .description {
    margin-top: 24px;
    line-height: 130%;
  }

  .collapsable {
    margin-top: 24px;
    width: 100%;
    position: absolute;
    padding: 0 0 0 24px;
    left: 0;
    bottom: 0;
    transform: translateY(0px);
    transition: transform 0.4s ease-in-out 0s;

    @include breakpoint-down-md {
      padding: 0 24px;
    }

    &.collapsed {
      transform: translateY(var(--properties-height));

      .header::before {
        opacity: 0;
        transition: opacity 0.4s ease-in-out;
      }
    }

    .header {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      height: 200px;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          to top,
          var(--bg-color) 0%,
          rgb(from var(--bg-color) r g b / 0.5) 50%,
          rgb(from var(--bg-color) r g b / 0.1) 100%
        );
        z-index: 0;
        opacity: 1;
        transition: opacity 0.4s ease-in-out 0.4s;
      }

      .moreButton {
        background-color: var(--bg-color);
        border: 1px solid color-mix(in srgb, var(--bg-color) 95%, #ffffff 5%);
        border-radius: 24px;
        padding: 12px;
        outline: none;
        margin-bottom: 14px;
        cursor: pointer;
        z-index: 1;
      }
    }
  }

  .properties {
    .property {
      display: flex;
      justify-content: space-between;
      padding: 18px 12px;

      &:nth-child(2n) {
        background-color: var(--bg-color);
      }

      &:nth-child(2n + 1) {
        background-color: color-mix(in srgb, var(--bg-color) 98%, #ffffff 2%);
      }
    }
  }
}
</style>
