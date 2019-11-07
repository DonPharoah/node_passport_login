import { BuildingConstants } from './buildingConstants';

let buildingList: BuildingList = [
  {
    color: 0x337700,
    name: 'MainBase',
    size: 13,
    type: BuildingConstants.TEST,
    handler: function() {
      console.log(`click from building: ${this.name}`);
    }
  },
  {
    color: 0xff0033,
    name: 'Barracks',
    size: 9,
    type: BuildingConstants.TEST2,
    handler: function() {
      console.log(`click from building: ${this.name}`);
    }
  },
  {
    color: 0x3377ff,
    name: 'Relay',
    size: 8,
    type: BuildingConstants.TEST,
    handler: function() {
      console.log(`click from building: ${this.name}`);
    }
  },
  {
    color: 0x3faaff,
    name: 'Test',
    size: 10,
    type: BuildingConstants.TEST,
    handler: function() {
      console.log(`click from building: ${this.name}`);
    }
  }
];

export default buildingList;
