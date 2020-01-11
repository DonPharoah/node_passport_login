declare type UnitPresetConstants = import('../../entities/unit').UnitPresetConstants;

interface UnitSchema {
  presetType: UnitPresetConstants;
  fillColor: number;
  name: string;
  size: number;
  maxHealth: number;
  range: number;
  update: () => void;
  testHandler: () => void;
}

type UnitPresets = {
  [key in UnitPresetConstants]: UnitSchema;
};
// does the same thing:
// type UnitPresets = Record<UnitPresetConstants, UnitSchema>;
