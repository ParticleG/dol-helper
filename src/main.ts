import { AutoDiver } from 'components/AutoDiver';

const autoDiver = new AutoDiver();

autoDiver.start(5).catch(console.warn);
