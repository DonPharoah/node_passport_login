import UIScene from '../uiScene';

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
let textArea;
const initTextArea = (scene: UIScene) => {
  let gameWidth = scene.game.config.width;
  textArea = scene.rexUI.add
    .textArea({
      width: (gameWidth as number) / 2 - 200,
      height: 200,
      anchor: {
        left: '50%',
        bottom: '100%'
      },
      space: {
        left: 5,
        right: 5,
        top: 5,
        bottom: 5
      },
      background: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 0, COLOR_PRIMARY).setStrokeStyle(3, 0x352222),
      text: scene.rexUI.add.BBCodeText()
    })
    .layout();
};
const getTextArea = () => textArea;

export { initTextArea, getTextArea };
