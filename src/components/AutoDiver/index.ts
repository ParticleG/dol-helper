import {
  checkContinue,
  checkSwarmInDepths,
  checkSwarmInRuin,
  getOxygen,
  getPassage,
  goDeeper,
  goShallower,
} from 'components/AutoDiver/utils.ts';
import { sleep } from 'utils/common.ts';

export class AutoDiver {
  private _needRevert: boolean = false;

  async start(count: number) {
    let extraRevertCount = 0;
    while (count >= 0) {
      await sleep(1000);
      const passage = await getPassage();
      const oxygen = await getOxygen(passage);

      console.log(`Passage type: ${passage.getAttribute('data-passage')}`);

      if (isNaN(oxygen)) {
        if (await checkSwarmInDepths(passage, extraRevertCount)) {
          this._needRevert = true;
          extraRevertCount++;
        } else if (!(await checkContinue(passage))) {
          extraRevertCount = 0;
          if (--count < 0) {
            break;
          }
          await goDeeper(passage);
        }
        continue;
      }

      console.log(`Oxygen Level: ${oxygen}`);

      if (await checkSwarmInRuin(passage)) {
        this._needRevert = true;
        continue;
      }
      if (!this._needRevert && (isNaN(oxygen) || oxygen >= 0.15)) {
        if (!(await goDeeper(passage))) {
          console.log('Swimming deeper passage not found');
          break;
        }
      } else {
        if (this._needRevert) {
          this._needRevert = false;
        }
        if (!(await goShallower(passage))) {
          console.log('Swimming shallower passage not found');
          break;
        }
      }
    }
  }
}
