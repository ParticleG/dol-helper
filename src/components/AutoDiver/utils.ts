import {
  SLEEP_INTERVAL,
  validPassageTypes,
} from 'components/AutoDiver/constants';
import { sleep } from 'utils/common.ts';
import { getElement } from 'utils/dom';

export const revert = async (times: number) => {
  for (let i = 0; i < times; i++) {
    (await getElement<HTMLLinkElement>('#history-backward'))?.click();
    await sleep(SLEEP_INTERVAL);
  }
};

export const getPassage = async () => {
  const passage = await getElement<HTMLDivElement>('.passage');
  if (!validPassageTypes.includes(passage.getAttribute('data-passage') ?? '')) {
    throw new Error('Lake diving passage not found');
  }
  return passage;
};

export const getTiredness = async () => {
  const tirednessMeter = document.querySelector(
    '#tirednesscaption > div.meter',
  );
  if (!tirednessMeter) {
    return NaN;
  }
  return parseFloat(tirednessMeter.querySelector('div')?.style.width ?? '0%');
};

export const getStress = async () => {
  const stressMeter = document.querySelector('#stresscaption > div.meter');
  if (!stressMeter) {
    return NaN;
  }
  return parseFloat(stressMeter.querySelector('div')?.style.width ?? '0%');
};
