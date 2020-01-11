let unitPresets: UnitPresets = {
  TEST: {
    presetType: 'TEST',
    fillColor: 0x337700,
    name: 'Home Base',
    size: 13,
    maxHealth: 1000,
    range: 50,
    update: function() {},
    testHandler: function() {
      console.log(`click from building: ${this.name}`);
    }
  },
  DESTROYER: {
    presetType: 'DESTROYER',
    fillColor: 0x337700,
    name: 'Destroyer',
    size: 13,
    maxHealth: 1000,
    range: 50,
    update: function() {},
    testHandler: function() {
      console.log(`click from building: ${this.name}`);
    }
  }
};

export default unitPresets;
