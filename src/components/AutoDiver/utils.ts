import {
  deeperPassageTypes,
  shallowerPassageTypes,
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

export const checkContinue = async () => {
  const passage = await getPassage();
  if (
    passage.getAttribute('data-passage') === 'Lake Depths' &&
    passage.querySelector<HTMLLinkElement>('span.purple')
  ) {
    const continuePassage = passage.querySelector<HTMLLinkElement>(
      `[data-passage='Lake Depths']`,
    );
    if (continuePassage) {
      console.log('Continue passage found');
      continuePassage.click();
      await sleep(SLEEP_INTERVAL);
      return true;
    }
  }
  return false;
}

export const goDeeper = async () => {
  const passage = await getPassage();
  for (const { name, description } of deeperPassageTypes) {
    const deeperPassage = passage.querySelector<HTMLLinkElement>(
      `[data-passage='${name}']`,
    );
    if (deeperPassage) {
      console.log(description);
      deeperPassage.click();
      await sleep(SLEEP_INTERVAL);
      return;
    }
  }
  throw new Error('Swimming deeper passage not found');
};

export const goShallower = async () => {
  const passage = await getPassage();
  for (const { name, description } of shallowerPassageTypes) {
    const shallowerPassage = passage.querySelector<HTMLLinkElement>(
      `[data-passage='${name}']`,
    );
    if (shallowerPassage) {
      console.log(description);
      shallowerPassage.click();
      await sleep(SLEEP_INTERVAL);
      return;
    }
  }
  throw new Error('Swimming shallower passage not found');
};
