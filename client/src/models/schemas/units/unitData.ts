import { Unit } from '../../entities/unit';

let unitData: UnitData = {
  [Unit.Types.TEST]: {
    color: 0x337700,
    name: 'Home Base',
    size: 13,
    type: Unit.Types.TEST,
    health: 1000,
    handler: function() {
      console.log(`click from building: ${this.name}`);
    }
  }
};

export default unitData;
