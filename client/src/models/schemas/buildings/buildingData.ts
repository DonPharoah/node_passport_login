import { Building } from '../../entities/building';

let buildingData: BuildingData = {
  [Building.Types.HOME_BASE]: {
    color: 0x337700,
    name: 'Home Base',
    size: 13,
    type: Building.Types.HOME_BASE,
    health: 1000,
    handler: function() {
      console.log(`click from building: ${this.name}`);
    }
  },
  [Building.Types.BARRACKS]: {
    color: 0xff0033,
    name: 'Barracks',
    size: 9,
    type: Building.Types.BARRACKS,
    health: 800,
    handler: function() {
      console.log(`click from building: ${this.name}`);
    }
  },
  [Building.Types.MINER]: {
    color: 0x3377ff,
    name: 'Miner',
    size: 8,
    type: Building.Types.MINER,
    health: 400,
    handler: function() {
      console.log(`click from building: ${this.name}`);
    }
  },
  [Building.Types.REPAIR_DRONE_FACTORY]: {
    color: 0x3faaff,
    name: 'Repair Done Factory',
    size: 10,
    type: Building.Types.REPAIR_DRONE_FACTORY,
    health: 600,
    handler: function() {
      console.log(`click from building: ${this.name}`);
    }
  }
};

export default buildingData;
