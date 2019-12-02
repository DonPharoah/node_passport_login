import UIScene from '../uiScene';

const COLOR_PRIMARY = 0x5c6666;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
let currentSelectedPanel;

const initCurrentSelectedPanel = (uiScene: UIScene) => {
  let title = uiScene.rexUI.add.label({
    orientation: 'x',
    text: uiScene.add.text(0, 0, 'Currently Selected', { fontSize: 18 })
  });
  currentSelectedPanel = uiScene.rexUI.add
    .sizer({
      width: 400,
      orientation: 'y'
    })
    // .addBackground(uiScene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_PRIMARY).setStrokeStyle(3, 0x352222))
    .add(title, 0, 'left', 3, true, 'title')
    .add(initTextArea(uiScene), 1, 'left', 5, true, 'textArea');

  return currentSelectedPanel;
};
const initTextArea = (uiScene: UIScene) => {
  let gameWidth = uiScene.game.config.width;
  let textArea = uiScene.rexUI.add.textArea({
    // width: (gameWidth as number) / 2 - 200,
    // width: 400,
    height: 200,
    // anchor: {
    //   left: '50%',
    //   bottom: '100%'
    // },
    space: {
      left: 5,
      right: 5,
      top: 5,
      bottom: 5
    },
    background: uiScene.rexUI.add.roundRectangle(0, 0, 20, 10, 0, COLOR_PRIMARY).setStrokeStyle(3, 0x352222),
    text: uiScene.rexUI.add.BBCodeText()
  });
  // .layout();
  return textArea;
};
const getCurrentSelectedPanel = () => currentSelectedPanel;
const hidePanel = (uiScene: UIScene) => {
  uiScene.rexUI.hide(currentSelectedPanel.getElement('textArea'));
  uiScene.rexUI.hide(currentSelectedPanel.getElement('title'));
  uiScene.rexUI.getTopmostSizer(currentSelectedPanel).layout();
};
const showPanel = (uiScene: UIScene) => {
  uiScene.rexUI.show(currentSelectedPanel.getElement('textArea'));
  uiScene.rexUI.show(currentSelectedPanel.getElement('title'));
  uiScene.rexUI.getTopmostSizer(currentSelectedPanel).layout();
};

export { initCurrentSelectedPanel, getCurrentSelectedPanel, hidePanel, showPanel };
