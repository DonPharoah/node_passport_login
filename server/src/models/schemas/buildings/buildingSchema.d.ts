declare type BuildingPresetConstants = import('../../entities/building').BuildingPresetConstants;

import ServerScene from '../../../scenes/serverScene';
import Entity from '../../entities/entity';
import { EntitySchema } from '../entitySchema';

interface BuildingSchema extends EntitySchema {
  presetType: BuildingPresetConstants;
  color: number;
  name: string;
  size: number;
  shape: 'TRIANGLE' | 'SQUARE' | 'RECTANGLE' | 'CIRCLE';
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
