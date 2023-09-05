import { AutoDiver } from 'components/AutoDiver';

const autoDiver = new AutoDiver(15, 90);

autoDiver.start().catch(console.warn);
