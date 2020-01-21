import Unit from '../../entities/unit';
import { Events } from '../../../models/schemas/eventConstants';
import ServerScene from '../../../scenes/serverScene';
import { BuildingPresets } from './buildingSchema';

let FACTORY_BUILDING_CREATE_UNIT = (
  scene: ServerScene,
  commandingBuilding: Building,
  buildingTargeted: Building
) => {
  const newUnit = new Unit(scene, commandingBuilding.body.position, 50, buildingTargeted, commandingBuilding);

  scene.addEntityToSceneAndNotify(scene.units, newUnit, Events.NEW_UNIT_ADDED, commandingBuilding.ownerId);
};

let buildingPresets: BuildingPresets = {
  HOME_BASE: {
    presetType: 'HOME_BASE',
    color: 0x337700,
    name: 'Home Base',
    size: 13,
    maxHealth: 1000,
    shape: 'RECTANGLE',
    update: function() {},
    command: function() {},
    testHandler: function() {
      console.log(`click from building: ${this.name}`);
    }
  },
  BARRACKS: {
    presetType: 'BARRACKS',
    color: 0xff0033,
    name: 'Barracks',
    size: 9,
    maxHealth: 800,
    shape: 'SQUARE',
    update: function() {},
    command: FACTORY_BUILDING_CREATE_UNIT,
    testHandler: function() {
      console.log(`click from building: ${this.name}`);
    }
  },
  MINER: {
    presetType: 'MINER',
    color: 0x3377ff,
    name: 'Miner',
    size: 8,
    maxHealth: 400,
    shape: 'TRIANGLE',
    update: function() {},
    command: function() {},
    testHandler: function() {
      console.log(`click from building: ${this.name}`);
    }
  },
  REPAIR_DRONE_FACTORY: {
    presetType: 'REPAIR_DRONE_FACTORY',
    color: 0x3faaff,
    name: 'Repair Done Factory',
    size: 10,
    maxHealth: 600,
    shape: 'CIRCLE',
    update: function() {},
    command: function() {},
    testHandler: function() {
      console.log(`click from building: ${this.name}`);
    }
  }
};

export default buildingPresets;
