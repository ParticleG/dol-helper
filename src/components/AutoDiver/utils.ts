import { getElement } from 'utils/dom';
import {
  deeperPassageTypes,
  shallowerPassageTypes,
  validPassageTypes,
} from 'components/AutoDiver/constants';
import { sleep } from 'utils/common.ts';

export const revert = async (times: number) => {
  for (let i = 0; i < times; i++) {
    (await getElement<HTMLLinkElement>('#history-backward'))?.click();
    await sleep(50);
  }
};

export const getPassage = async () => {
  const passage = await getElement('.passage');
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
  return (
    parseFloat(tirednessMeter.querySelector('div')?.style.width ?? '0%') / 100
  );
};

export const getStress = async () => {
  const stressMeter = document.querySelector('#stresscaption > div.meter');
  if (!stressMeter) {
    return NaN;
  }
  return (
    parseFloat(stressMeter.querySelector('div')?.style.width ?? '0%') / 100
  );
};

export const getOxygen = async (passage: HTMLElement) => {
  const oxygenMeter = passage.querySelector('#oxygencaption > div.meter');
  if (!oxygenMeter) {
    return NaN;
  }
  return (
    parseFloat(oxygenMeter.querySelector('div')?.style.width ?? '0%') / 100
  );
};

export const checkContinue = async (passage: HTMLElement) => {
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
      return true;
    }
  }
  return false;
};

export const checkSwarmInDepths = async (
  passage: HTMLElement,
  extraRevertCount: number,
) => {
  const depthsSwarm = passage.querySelector<HTMLLinkElement>(
    `[data-passage='Lake Depths Swarm']`,
  );
  if (depthsSwarm) {
    console.log('Captured by swarms in Lake Depths! Reverting...');
    await revert(3 + extraRevertCount);
    return true;
  }
  return false;
};

export const checkSwarmInRuin = async (passage: HTMLElement) => {
  const revertPassage = passage.querySelector<HTMLLinkElement>(
    `[data-passage='Lake Swarm']`,
  );
  if (revertPassage) {
    console.log('Captured by swarms in Ruin! Reverting...');
    await revert(1);
    return true;
  }
  return false;
};

export const goDeeper = async (passage: HTMLElement) => {
  for (const { name, description } of deeperPassageTypes) {
    const deeperPassage = passage.querySelector<HTMLLinkElement>(
      `[data-passage='${name}']`,
    );
    if (deeperPassage) {
      console.log(description);
      deeperPassage.click();
      return true;
    }
  }
  return false;
};

export const goShallower = async (passage: HTMLElement) => {
  for (const { name, description } of shallowerPassageTypes) {
    const shallowerPassage = passage.querySelector<HTMLLinkElement>(
      `[data-passage='${name}']`,
    );
    if (shallowerPassage) {
      console.log(description);
      shallowerPassage.click();
      return true;
    }
  }
  return false;
};
