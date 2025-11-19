import { h, nextTick, ref, useCssModule } from 'vue';

export function useLines(style: ReturnType<typeof useCssModule>) {
  const config = ref({
    visible: false,
    vertical: {
      left: { left: '0', '--gradient': '0%', height: '0px' },
      right: { left: '0', '--gradient': '0%', height: '0px' },
    },
    horizontal: {
      top: { top: '0', '--gradient': '0%', width: '0px' },
      bottom: { top: '0', '--gradient': '0%', width: '0px' },
    },
  });

  async function setLines(el: HTMLDivElement) {
    config.value.visible = false;
    await nextTick();

    const { offsetLeft: x, offsetTop: y } = el;
    const { width, height } = getComputedStyle(el);

    config.value.vertical.left.left = `${x}px`;
    config.value.vertical.right.left = `${x + parseInt(width) - 1}px`;
    config.value.horizontal.top.top = `${y}px`;
    config.value.horizontal.bottom.top = `${y + parseInt(height) - 1}px`;

    if (el.parentElement) {
      const { scrollWidth: parentWidth, scrollHeight: parentHeight } = el.parentElement;

      const gradient = {
        vertical: `${((y + parseInt(height) / 2) / parentHeight) * 100}%`,
        horizontal: `${((x + parseInt(width) / 2) / parentWidth) * 100}%`,
      };

      config.value.vertical.left['--gradient'] = gradient.vertical;
      config.value.vertical.right['--gradient'] = gradient.vertical;
      config.value.horizontal.top['--gradient'] = gradient.horizontal;
      config.value.horizontal.bottom['--gradient'] = gradient.horizontal;

      config.value.vertical.left.height = `${parentHeight}px`;
      config.value.vertical.right.height = `${parentHeight}px`;
      config.value.horizontal.top.width = `${parentWidth}px`;
      config.value.horizontal.bottom.width = `${parentWidth}px`;
    }

    config.value.visible = true;
  }

  function hideLines() {
    config.value.visible = false;
  }

  const lines = () =>
    [
      h('div', { class: [style.line, style.vertical], style: config.value.vertical.left }),
      h('div', { class: [style.line, style.vertical], style: config.value.vertical.right }),
      h('div', { class: [style.line, style.horizontal], style: config.value.horizontal.top }),
      h('div', { class: [style.line, style.horizontal], style: config.value.horizontal.bottom }),
    ].filter(() => config.value.visible);

  return { lines, setLines, hideLines };
}
