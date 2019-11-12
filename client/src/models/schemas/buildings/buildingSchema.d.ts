interface BuildingSchema {
  type: import('../../entities/building').Building.Types;
  color: number;
  name: string;
  size: number;
  health: number;
  handler: () => void;
}
interface BuildingData {
  [buildingType: string]: BuildingSchema;
}
