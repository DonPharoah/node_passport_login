import ClientScene from '../../../../scenes/clientScene';
import { BuildingConstants } from '../../../../interfaces/buildingConstants';

let buildingList: BuildingList = [
  {
    color: 0xff0033,
    name: 'MainBase',
    size: 20,
    type: BuildingConstants.TEST,
    handler: () => console.log(`click from building: ${name}`)
  },
  {
    color: 0x337700,
    name: 'Brothel',
    size: 30,
    type: BuildingConstants.TEST2,
    handler: () => console.log(`click from building: ${name}`)
  },
  {
    color: 0x3377ff,
    name: 'See you space cowboy',
    size: 15,
    type: BuildingConstants.TEST,
    handler: () => console.log(`click from building: ${name}`)
  }
];

export default buildingList;
