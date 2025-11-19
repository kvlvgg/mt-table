<template>
  <span :class="textClasses">
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed, useCssModule, type PropType } from 'vue';

const props = defineProps({
  text: { type: String, default: null },
  font: { type: String as PropType<'extralight' | 'regular' | 'medium'>, default: 'regular' },
  size: { type: String as PropType<'xs' | 'sm' | 'md' | 'xl' | 'x3l'>, default: 'md' },
  block: { type: Boolean, default: false },
});

const style = useCssModule();

const textClasses = computed(() => ({
  [style.text]: true,
  [style[`font-${props.font}-${props.size}`] as string]: true,
  [style.block]: props.block,
}));
</script>

<style module lang="scss">
@use '@/assets/scss/fonts.scss' as *;

.block {
  display: block;
}

.text {
  color: var(--text-color);
}

.font-medium-x3l {
  @include font-medium;
  font-size: 64px;
}

.font-medium-xl {
  @include font-medium;
  font-size: 32px;
}

.font-medium-md {
  @include font-medium;
  font-size: 16px;
}

.font-medium-sm {
  @include font-medium;
  font-size: 14px;
}

.font-medium-xs {
  @include font-medium;
  font-size: 12px;
}

.font-regular-x3l {
  @include font-regular;
  font-size: 64px;
}

.font-regular-xl {
  @include font-regular;
  font-size: 32px;
}

.font-regular-md {
  @include font-regular;
  font-size: 16px;
}

.font-regular-sm {
  @include font-regular;
  font-size: 14px;
}

.font-regular-xs {
  @include font-regular;
  font-size: 12px;
}

.font-extralight-x3l {
  @include font-extralight;
  font-size: 64px;
}

.font-extralight-xl {
  @include font-extralight;
  font-size: 32px;
}

.font-extralight-md {
  @include font-extralight;
  font-size: 16px;
}

.font-extralight-sm {
  @include font-extralight;
  font-size: 14px;
}

.font-extralight-xs {
  @include font-extralight;
  font-size: 12px;
}
</style>
