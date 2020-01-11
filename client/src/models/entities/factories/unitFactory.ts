import { UnitPresetConstants, Unit } from '../unit';
import unitPresets from '../../schemas/units/unitPresets';
import ClientScene from '../../../scenes/clientScene';

export class UnitFactory {
  public static createUnit(
    presetType: UnitPresetConstants,
    scene: ClientScene,
    position: { x: number; y: number },
    id: string,
    ownerId: string
  ) {
    return new Unit(scene, position, id, ownerId, presetType);
  }
}
