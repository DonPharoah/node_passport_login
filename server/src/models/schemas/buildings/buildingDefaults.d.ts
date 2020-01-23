declare type BuildingPresetConstants = import('../../entities/building').BuildingPresetConstants;
declare type ServerScene = import('../../../scenes/serverScene').default;
declare type Entity = import('../../entities/entity').default;

// import ServerScene from '../../../scenes/serverScene';
// import Entity from '../../entities/entity';

interface BuildingDefaults {
  presetType: BuildingPresetConstants;
  // uniqueComposites: UniqueComposite[];
  color: number;
  name: string;
  size: number;
  shape: 'TRIANGLE' | 'SQUARE' | 'RECTANGLE' | 'CIRCLE';
  maxHealth: number;
  update: () => void;
  rightClickCommand: (
    scene: ServerScene,
    issuingEntity: Entity,
    targetEntity: Entity,
    clickPosition: { x; y }
  ) => void;
  testHandler: () => void;
}

type BuildingPresets = {
  [key in BuildingPresetConstants]: BuildingDefaults;
};

// interface BarracksProperties extends BuildingDefaults {
//   drones: Unit[];
// }

// type BuildingPresets = Record<BuildingPresetConstants, BuildingSchema>;
