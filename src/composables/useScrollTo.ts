import type { Ref } from 'vue';

export function useScrollTo(parent: Ref<HTMLDivElement | null>) {
  function scrollTo(el: HTMLDivElement) {
    window.setTimeout(() => {
      if (!parent.value) return;
      console.log(parent.value.scrollLeft);

      let { width } = getComputedStyle(parent.value);
      const parentWidth = parseInt(width);

      width = getComputedStyle(parent.value).width;
      const childWidth = parseInt(width);
      const childOffsetLeft = el.offsetLeft;

      parent.value.style.scrollBehavior = 'smooth';
      parent.value.scrollLeft = childOffsetLeft + childWidth / 2 - parentWidth;

      window.setTimeout(() => {
        if (!parent.value) return;
        parent.value.style.removeProperty('scroll-behavior');
      }, 1000);
    });
  }

  return { scrollTo };
}
