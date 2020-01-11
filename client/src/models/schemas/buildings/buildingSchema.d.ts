declare type BuildingPresetConstants = import('../../entities/building').BuildingPresetConstants;

interface BuildingSchema {
  presetType: BuildingPresetConstants;
  color: number;
  name: string;
  size: number;
  shape: 'TRIANGLE' | 'SQUARE' | 'RECTANGLE' | 'CIRCLE';
  maxHealth: number;
  update: () => void;
  testHandler: () => void;
}

type BuildingPresets = {
  [key in BuildingPresetConstants]: BuildingSchema;
};
// type BuildingPresets = Record<BuildingPresetConstants, BuildingSchema>;
