interface BuildingSchema {
  type: import('./buildingConstants').BuildingConstants;
  color: number;
  name: string;
  size: number;
  handler: () => void;
}
type BuildingList = BuildingSchema[];
