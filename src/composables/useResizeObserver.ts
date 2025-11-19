import { onMounted, type Ref } from 'vue';

export function useResizeObserver(el: Ref<HTMLDivElement | null>, cb: () => void) {
  onMounted(() => {
    if (!el.value) return;

    const observer = new ResizeObserver(cb);
    observer.observe(el.value);
  });
}
