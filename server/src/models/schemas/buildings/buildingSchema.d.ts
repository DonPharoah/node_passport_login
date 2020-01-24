declare type BuildingPresetConstants = import('../../entities/building').BuildingPresetConstants;

import ServerScene from '../../../scenes/serverScene';
import Entity from '../../entities/entity';

interface BuildingSchema {
  presetType: BuildingPresetConstants;
  color: number;
  name: string;
  size: number;
  shape: 'TRIANGLE' | 'SQUARE' | 'RECTANGLE' | 'CIRCLE';
  maxHealth: number;
  update: () => void;
  command: (
    scene: ServerScene,
    commandingEntity: Building,
    targetEntity: Entity,
    clickPosition: { x; y }
  ) => void;
  testHandler: () => void;
}

type BuildingPresets = {
  [key in BuildingPresetConstants]: BuildingSchema;
};

// type BuildingPresets = Record<BuildingPresetConstants, BuildingSchema>;
