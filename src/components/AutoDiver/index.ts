import { SHALLOW_TIMES } from 'components/AutoDiver/constants.ts';
import {
  checkContinue,
  getPassage,
  getStress,
  goDeeper,
  goShallower,
  revert,
} from 'components/AutoDiver/utils.ts';

export class AutoDiver {
  private _extraRevertCount: number = 0;
  private readonly _oxygenThreshold: number;
  private readonly _stressThreshold: number;

  constructor(oxygenThreshold: number, stressThreshold: number) {
    this._oxygenThreshold = oxygenThreshold;
    this._stressThreshold = stressThreshold;
  }

  async start() {
    let stress = await getStress();
    while (!isNaN(stress) && stress < this._stressThreshold) {
      console.log(`Stress Level: ${stress}`);
      const oxygen = await this._getOxygen();

      if (isNaN(oxygen)) {
        if (await this._checkSwarmInDepths()) {
          for (let index = 0; index < SHALLOW_TIMES; index++) {
            await goShallower();
          }
        } else {
          if (!(await checkContinue())) {
            await goDeeper();
          }
          this._extraRevertCount = 0;
        }
        continue;
      }

      console.log(`Oxygen Level: ${oxygen}`);

      if (await this._checkSwarmInRuin()) {
        await goShallower();
        continue;
      }

      if (oxygen < this._oxygenThreshold) {
        await goShallower();
      } else {
        await goDeeper();
      }
      stress = await getStress();
    }

    // Make sure we're not in the middle of the lake
    if (!isNaN(await this._getOxygen())) {
      while (true) {
        try {
          for (let index = 0; index < SHALLOW_TIMES; index++) {
            await goShallower();
          }
        } catch {}
        if (await this._checkSwarmInDepths()) {
          continue;
        }
        await checkContinue();
        break;
      }
    }
  }

  private async _getOxygen() {
    const passage = await getPassage();
    const oxygenMeter = passage.querySelector<HTMLDivElement>(
      '#oxygencaption > div.meter',
    );
    return oxygenMeter
      ? parseFloat(oxygenMeter.querySelector('div')?.style.width ?? '0%')
      : NaN;
  }

  private async _checkSwarmInDepths() {
    const passage = await getPassage();
    const depthsSwarm = passage.querySelector<HTMLLinkElement>(
      `[data-passage='Lake Depths Swarm']`,
    );
    if (depthsSwarm) {
      console.log('Captured by swarms in Lake Depths! Reverting...');
      await revert(3 + this._extraRevertCount++);
      return true;
    }
    return false;
  }

  private async _checkSwarmInRuin() {
    const passage = await getPassage();
    const revertPassage = passage.querySelector<HTMLLinkElement>(
      `[data-passage='Lake Swarm']`,
    );
    if (revertPassage) {
      console.log('Captured by swarms in Ruin! Reverting...');
      await revert(1);
      return true;
    }
    return false;
  }
}
