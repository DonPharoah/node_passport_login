interface UnitSchema {
  type: import('../../entities/unit').Unit.Types;
  color: number;
  name: string;
  size: number;
  health: number;
  handler: () => void;
}
interface UnitData {
  [unitType: string]: UnitSchema;
}
