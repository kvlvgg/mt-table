import { h, ref, type Ref, type useCssModule } from 'vue';

import type { ChemicalElement } from '@/types';
import Text from '@/components/Text.vue';

type Group = number;
type Period = number;
type GridPos = { gridColumn: number; gridRow: number };

export function usePeriodicNet(
  elements: ChemicalElement[],
  selectedElement: Ref<ChemicalElement | null>,
  style: ReturnType<typeof useCssModule> & {
    netNumber: string;
    top: string;
    bottom: string;
    left: string;
    right: string;
    selected: string;
  }
) {
  const config = ref({
    group: {
      top: new Map<Group, GridPos>(),
      bottom: new Map<Group, GridPos>(),
    },

    period: {
      left: new Map<Period, GridPos>(),
      right: new Map<Period, GridPos>(),
    },
  });

  for (const element of elements) {
    // group top
    let pos: GridPos | null = config.value.group.top.get(element.group) ?? null;
    if (!pos) pos = { gridColumn: element.group + 1, gridRow: 0 };
    if (pos.gridRow === 0) pos.gridRow = element.period;

    config.value.group.top.set(element.group, pos);

    // group bottom
    pos = config.value.group.bottom.get(element.group) ?? null;
    if (!pos) pos = { gridColumn: element.group + 1, gridRow: element.period + 1 };

    pos.gridColumn = element.group + 1;
    pos.gridRow = pos.gridRow + 1;

    config.value.group.bottom.set(element.group, pos);

    // period left
    pos = config.value.period.left.get(element.period) ?? null;
    if (!pos) pos = { gridColumn: 1, gridRow: 0 };
    if (pos.gridRow === 0) pos.gridRow = element.period + 1;

    config.value.period.left.set(element.period, pos);

    // period right
    pos = config.value.period.right.get(element.period) ?? null;
    if (!pos) pos = { gridColumn: 0, gridRow: 0 };

    pos.gridColumn = element.group + 2;
    pos.gridRow = element.period + 1;

    config.value.period.right.set(element.period, pos);
  }

  function isSelectedGroup(group: number) {
    return group === selectedElement.value?.group;
  }

  function isSelectedPeriod(period: number) {
    return period === selectedElement.value?.period;
  }

  const net = {
    group: {
      top: () => [
        Array.from(config.value.group.top.entries()).map(([group, pos]) =>
          h(
            'div',
            {
              class: {
                [style.netNumber]: true,
                [style.top]: true,
                [style.selected]: isSelectedGroup(group),
              },
              style: pos,
            },
            [h(Text, { class: style.text, font: 'medium', size: 'xs' }, () => group)]
          )
        ),
      ],

      bottom: () => [
        Array.from(config.value.group.bottom.entries()).map(([group, pos]) =>
          h(
            'div',
            {
              class: {
                [style.netNumber]: true,
                [style.bottom]: true,
                [style.selected]: isSelectedGroup(group),
              },
              style: pos,
            },
            [h(Text, { class: style.text, font: 'medium', size: 'xs' }, () => group)]
          )
        ),
      ],
    },

    period: {
      left: () => [
        Array.from(config.value.period.left.entries()).map(([period, pos]) =>
          h(
            'div',
            {
              class: {
                [style.netNumber]: true,
                [style.left]: true,
                [style.selected]: isSelectedPeriod(period),
              },
              style: pos,
            },
            [h(Text, { class: style.text, font: 'medium', size: 'xs' }, () => period)]
          )
        ),
      ],

      right: () => [
        Array.from(config.value.period.right.entries()).map(([period, pos]) =>
          h(
            'div',
            {
              class: {
                [style.netNumber]: true,
                [style.right]: true,
                [style.selected]: isSelectedPeriod(period),
              },
              style: pos,
            },
            [h(Text, { class: style.text, font: 'medium', size: 'xs' }, () => period)]
          )
        ),
      ],
    },
  };

  return { net };
}
