import { BuildingPresetConstants, Building } from '../building';
import buildingPresets from '../../schemas/buildings/buildingPresets';
import ClientScene from '../../../scenes/clientScene';

export class BuildingFactory {
  public static creatBuilding(
    presetType: BuildingPresetConstants,
    scene: ClientScene,
    position: { x: number; y: number },
    id: string,
    ownerId: string
  ) {
    return new Building(scene, position, id, ownerId, presetType);
  }
}
