import { ref, type Ref } from 'vue';

export function useDraggingScroll(el: Ref<HTMLDivElement | null>) {
  const isDragging = ref(false);
  const startX = ref(0);
  const scrollLeft = ref(0);

  function onMouseDown(e: MouseEvent) {
    if (!el.value) return;

    isDragging.value = true;
    el.value.style.cursor = 'grabbing';
    startX.value = e.pageX - el.value.offsetLeft;
  }

  function onMouseMove(e: MouseEvent) {
    if (!el.value || !isDragging.value) return;

    const x = e.pageX - el.value.offsetLeft;
    const walk = (x - startX.value) * 2;
    el.value.scrollLeft = scrollLeft.value - walk;
  }

  function onMouseUp() {
    if (!el.value) return;

    isDragging.value = false;
    el.value.style.cursor = '';
  }

  return { onMouseDown, onMouseMove, onMouseUp };
}
