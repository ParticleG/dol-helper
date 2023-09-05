import {
  deeperPassageTypes,
  SHALLOW_TIMES,
  shallowerPassageTypes,
  SLEEP_INTERVAL,
} from 'components/AutoDiver/constants.ts';
import { getPassage, getStress, revert } from 'components/AutoDiver/utils.ts';
import { sleep } from 'utils/common.ts';

export class AutoDiver {
  private _extraRevertCount: number = 0;
  private readonly _oxygenThreshold: number;
  private _passage: HTMLDivElement = document.createElement('div');
  private readonly _stressThreshold: number;

  constructor(oxygenThreshold: number, stressThreshold: number) {
    this._oxygenThreshold = oxygenThreshold;
    this._stressThreshold = stressThreshold;
  }

  async start() {
    let stress = await getStress();
    while (!isNaN(stress) && stress < this._stressThreshold) {
      console.log(`Stress Level: ${stress}`);

      this._passage = await getPassage();
      const oxygen = await this._getOxygen();

      console.log(
        `Passage type: ${this._passage.getAttribute('data-passage')}`,
      );

      if (isNaN(oxygen)) {
        if (await this._checkSwarmInDepths()) {
          for (let index = 0; index < SHALLOW_TIMES; index++) {
            await this._goShallower();
          }
        } else {
          if (!(await this._checkContinue())) {
            await this._goDeeper();
          }
          this._extraRevertCount = 0;
        }
        continue;
      }

      console.log(`Oxygen Level: ${oxygen}`);

      if (await this._checkSwarmInRuin()) {
        await this._goShallower();
        continue;
      }

      if (oxygen < this._oxygenThreshold) {
        await this._goShallower();
      } else {
        await this._goDeeper();
      }
      stress = await getStress();
    }
  }

  private async _getOxygen() {
    const oxygenMeter = this._passage.querySelector<HTMLDivElement>(
      '#oxygencaption > div.meter',
    );
    return oxygenMeter
      ? parseFloat(oxygenMeter.querySelector('div')?.style.width ?? '0%')
      : NaN;
  }

  private async _checkContinue() {
    if (
      this._passage.getAttribute('data-passage') === 'Lake Depths' &&
      this._passage.querySelector<HTMLLinkElement>('span.purple')
    ) {
      const continuePassage = this._passage.querySelector<HTMLLinkElement>(
        `[data-passage='Lake Depths']`,
      );
      if (continuePassage) {
        console.log('Continue passage found');
        continuePassage.click();
        return true;
      }
    }
    return false;
  }

  private async _checkSwarmInDepths() {
    const depthsSwarm = this._passage.querySelector<HTMLLinkElement>(
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
    const revertPassage = this._passage.querySelector<HTMLLinkElement>(
      `[data-passage='Lake Swarm']`,
    );
    if (revertPassage) {
      console.log('Captured by swarms in Ruin! Reverting...');
      await revert(1);
      return true;
    }
    return false;
  }

  private async _goDeeper() {
    for (const { name, description } of deeperPassageTypes) {
      const deeperPassage = this._passage.querySelector<HTMLLinkElement>(
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
  }

  private async _goShallower() {
    for (const { name, description } of shallowerPassageTypes) {
      const shallowerPassage = this._passage.querySelector<HTMLLinkElement>(
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
  }
}
