import { type Ref } from 'vue';

export function useInvertWheelBehaviour(el: Ref<HTMLDivElement | null>) {
  function onWheel(e: WheelEvent) {
    if (!el.value) return;
    if (e.deltaY > 0) el.value.scrollLeft += 100;
    else el.value.scrollLeft -= 100;
  }

  return { onWheel };
}
