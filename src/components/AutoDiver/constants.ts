import { PassageType } from 'components/AutoDiver/types.ts';

export const SLEEP_INTERVAL = 1000;
export const SHALLOW_TIMES = 3;

export const validPassageTypes = [
  'Lake Depths',
  'Lake Pots',
  'Lake Ruin',
  'Lake Ruin Box',
  'Lake Ruin Deep',
  'Lake Underwater',
];
export const deeperPassageTypes: PassageType[] = [
  { name: 'Lake Ruin Box', description: 'Opening Lake Ruin Box...' },
  { name: 'Lake Ruin Deep', description: 'Swimming towards deeper ruin...' },
  { name: 'Lake Underwater', description: 'Diving towards Underwater...' },
  { name: 'Lake Pots', description: 'Searching Lake Pots...' },
  { name: 'Lake Ruin', description: 'Swimming towards ruin...' },
];
export const shallowerPassageTypes: PassageType[] = [
  { name: 'Lake Depths', description: 'Swimming towards surface...' },
  { name: 'Lake Underwater', description: 'Swimming towards underwater...' },
  { name: 'Lake Ruin', description: 'Swimming towards ruin exit...' },
];
