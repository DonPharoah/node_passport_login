import { Building } from '../models/entities/building';
import ClientScene from '../scenes/clientScene';
import { Unit } from '../models/entities/unit';
import { Entity } from '../models/entities/entity';
import { UnitFactory } from '../models/entities/factories/unitFactory';
import { BuildingFactory } from '../models/entities/factories/buildingFactory';
import UIScene from '../views/uiScene';

export class Utils {
  public static uiScene(game: Phaser.Game): UIScene {
    return game.scene.getScene('uiScene') as UIScene;
  }
  public static addNewBuildingToScene(
    scene: ClientScene,
    options: {
      position: { x; y };
      id: string;
      ownerId: string;
      type: BuildingPresetConstants;
      targetId?: string;
    }
  ): Building {
    const { position, id, ownerId, type } = options;
    // const newBuilding = new Building(scene, position, id, ownerId, 'BARRACKS');
    const newBuilding = BuildingFactory.creatBuilding(type, scene, position, id, ownerId);
    newBuilding.rectangle.setStrokeStyle(3, parseInt(scene.playersList[ownerId].color, 16));
    scene.add.existing(newBuilding);
    return newBuilding;
  }

  public static addNewUnitToScene(
    scene: ClientScene,
    options: { position: { x; y }; id: string; ownerId: string },
    targetId?: string
  ) {
    const { position, id, ownerId } = options;
    // const newUnit = new Unit(scene, position, id, ownerId, 'TEST');
    const newUnit = UnitFactory.createUnit('TEST', scene, position, id, ownerId);
    newUnit.rectangle.setStrokeStyle(3, parseInt(scene.playersList[ownerId].color, 16));
    scene.add.existing(newUnit); //not showing
  }

  public static removeBuildingFromScene(scene: ClientScene, removeBuildingId) {
    let uiScene = Utils.uiScene(scene.game);
    const deleteBuilding = Utils.findBuildingById(scene, removeBuildingId);
    deleteBuilding.destroy();
    deleteBuilding.remove();
    uiScene.showOverlayError('Building removed');
  }

  public static removeUnitFromScene(scene: ClientScene, removeUnitId) {
    let uiScene = Utils.uiScene(scene.game);
    const deleteUnit = Utils.findUnitById(scene, removeUnitId);
    deleteUnit.destroy();
    deleteUnit.remove();
    uiScene.showOverlayMessage('Unit removed.');
    console.log('new state of unit group:');
    console.log(scene.units.getChildren());
  }

  public static getBuildingsOfOwner(scene: ClientScene, ownerId, callback) {
    let buildings = scene.buildings.getChildren() as Building[];
    let filteredBuildings = buildings.filter((match) => match.ownerId === ownerId);
    callback(filteredBuildings);
  }

  public static getUnitsOfOwner(scene: ClientScene, ownerId, callback) {
    let units = scene.units.getChildren() as Unit[];
    let filteredUnits = units.filter((match) => match.ownerId === ownerId);
    callback(filteredUnits);
  }

  public static findBuildingById(scene: ClientScene, id: string): Building {
    let buildingArray = scene.buildings.getChildren();
    let foundBuilding = buildingArray.find((currentBuilding: Building) => {
      return currentBuilding.id === id;
    });
    if (!foundBuilding) throw new Error(`Building ${id} could not be found`);
    return foundBuilding as Building;
  }

  public static findUnitById(scene: ClientScene, id: string): Unit {
    let unitArray = scene.units.getChildren();
    let foundUnit = unitArray.find((currentUnit: Unit) => {
      return currentUnit.id === id;
    });
    if (!foundUnit) throw new Error(`Unit ${id} could not be found`);
    return foundUnit as Unit;
  }

  public static findEntityByIdAndRun(
    scene: ClientScene,
    uuid: string,
    runOnEntity: (entity: Entity & Damagable) => void
  ): void {
    let buildingArray = scene.buildings.getChildren();
    let foundBuilding = buildingArray.find((currentBuilding: Building) => {
      return currentBuilding.id === uuid;
    });
    if (foundBuilding) {
      runOnEntity(foundBuilding as Building);
      return;
    } else {
      //console.log('building not found!');
    }
    let unitArray = scene.units.getChildren();
    let foundUnit = unitArray.find((currentUnit: Unit) => {
      return currentUnit.id === uuid;
    });
    if (foundUnit) {
      runOnEntity(foundUnit as Unit);
    } else {
      //console.log('unit not found!');
    }
  }
}
