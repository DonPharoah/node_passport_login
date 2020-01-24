import Unit from '../../entities/unit';
import { Events } from '../../../models/schemas/eventConstants';
import ServerScene from '../../../scenes/serverScene';
// import { BuildingPresets } from './buildingSchema';
import Entity from '../../entities/entity';

let buildingPresets: BuildingPresets = {
  HOME_BASE: {
    presetType: 'HOME_BASE',
    color: 0x337700,
    name: 'Home Base',
    size: 13,
    maxHealth: 1000,
    shape: 'RECTANGLE',
    update: function() {},
    rightClickCommand: function() {},
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
    rightClickCommand: buildUnitCommand,
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
    rightClickCommand: function() {},
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
    rightClickCommand: function() {},
    testHandler: function() {
      console.log(`click from building: ${this.name}`);
    }
  }
};

function buildUnitCommand(scene: ServerScene, commandingBuilding: Building, buildingTargeted: Building) {
  let factoryBuilding: any = commandingBuilding;
  const createUnit = () => {
    // create new Drone and push it to list
    const newUnit = new Unit(
      scene,
      commandingBuilding.body.position,
      50,
      buildingTargeted,
      commandingBuilding
    );

    factoryBuilding.drones.push(newUnit);
    // add new drone to scene
    scene.addEntityToSceneAndNotify(scene.units, newUnit, Events.NEW_UNIT_ADDED, commandingBuilding.ownerId);
    // building listen for drone's destruction and remove from list
    newUnit.addDestructionCallback((destroyedDrone: Unit) => {
      factoryBuilding.drones = factoryBuilding.drones.filter(
        (currentDrone: Unit) => currentDrone !== destroyedDrone
      );
    });
    // drone listen for command Buildings destruction and self desruct for now.
    commandingBuilding.addDestructionCallback(() => {
      factoryBuilding.drones.forEach((drone: Unit) => {
        drone.destroy();
      });
    });
  };

  const sendUnit = () => {
    factoryBuilding.drones.forEach((drone) => {
      drone.designateFollowTarget(scene, buildingTargeted, commandingBuilding);
    });
  };

  if (factoryBuilding.drones) {
    if (factoryBuilding.drones.length < 5) {
      createUnit();
    } else {
    }
    sendUnit();
  } else {
    factoryBuilding.drones = [];
    createUnit();
    sendUnit();
  }
}

export default buildingPresets;
