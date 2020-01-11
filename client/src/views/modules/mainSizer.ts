import UIScene from '../uiScene';

const COLOR_PRIMARY = 0x889494;
const COLOR_LIGHT = 0x5fd4d4;
const COLOR_DARK = 0x260e04;
let mainSizer;
let data = {
  name: 'Rex',
  skills: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }],
  items: [
    { name: 'A' },
    { name: 'B' },
    { name: 'C' },
    { name: 'D' },
    { name: 'E' },
    { name: 'F' },
    { name: 'G' },
    { name: 'H' },
    { name: 'I' },
    { name: 'J' },
    { name: 'K' },
    { name: 'L' },
    { name: 'M' }
  ]
};
const createMainSizer = (uiScene: UIScene) => {
  mainSizer = uiScene.rexUI.add
    .sizer({
      y: 250,
      width: 800,
      anchor: {
        left: '0%',
        bottom: '100%'
      },
      orientation: 'x'
    })
    .addBackground(
      uiScene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY).setStrokeStyle(3, 0x352222)
    );
  // .add(createHeader(uiScene, data), 100, 'center', 0, true)
  // .add(createHeader(uiScene, data), 100, 'center', 10, true);
  // .add(uiScene.rexUI.add.roundRectangle(0, 0, 1000, 200, 10, COLOR_LIGHT))
  // mainSizer.layout();

  return mainSizer;
};

export const getMainSizer = () => {
  if (!mainSizer) {
    throw new Error('mainSizer not defined');
  }
  return mainSizer;
};

export { createMainSizer };
