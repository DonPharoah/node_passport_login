import UIScene from '../uiScene';

const COLOR_PRIMARY = 0x5c6666;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
let multipurposePanel;

const createMultipurposePanel = (uiScene: UIScene) => {
  let createTitle = (titleText: string) => {
    let title = uiScene.rexUI.add.label({
      orientation: 'x',
      text: uiScene.add.text(0, 0, titleText, {
        fontSize: 18,
        fontFamily: 'Arial',
        resolution: 2
      })
    });
    return title;
  };
  multipurposePanel = uiScene.rexUI.add
    .sizer({
      width: 400,
      orientation: 'y'
    })
    // .addBackground(uiScene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_PRIMARY).setStrokeStyle(3, 0x352222))
    .add(createTitle('Title'), 0, 'left', 3, true, 'title')
    .add(createInnerSizer(uiScene, 'deleteDialog'), 1, 'left', 5, true, 'innerSizer');

  setTimeout(() => {
    let innerSizer = multipurposePanel.getElement('innerSizer');
    innerSizer.clear(true);
    multipurposePanel.clear(true);
    multipurposePanel.layout();
  }, 2000);
  setTimeout(() => {
    multipurposePanel.add(createTitle('Are you sure?'), 0, 'left', 3, true, 'title');
    multipurposePanel.add(createInnerSizer(uiScene, 'deleteDialog'), 1, 'left', 5, true, 'innerSizer');
    uiScene.rexUI.getTopmostSizer(multipurposePanel).layout();
  }, 4000);

  return multipurposePanel;
};

// const initTextArea = (uiScene: UIScene) => {
//   let gameWidth = uiScene.game.config.width;
//   let textArea = uiScene.rexUI.add.textArea({
//     height: 200,
//     space: {
//       left: 5,
//       right: 5,
//       top: 5,
//       bottom: 5
//     },
//     background: uiScene.rexUI.add.roundRectangle(0, 0, 20, 10, 0, COLOR_PRIMARY).setStrokeStyle(3, 0x352222),
//     text: uiScene.rexUI.add.BBCodeText()
//   });
//   return textArea;
// };

const createInnerSizer = (uiScene: UIScene, options?: 'deleteDialog' | 'ffff') => {
  let innerSizer = uiScene.rexUI.add
    .sizer({
      orientation: 'y'
    })
    .addBackground(
      uiScene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY).setStrokeStyle(3, 0x352222)
    );
  if (options == 'deleteDialog') {
    populateDeleteDialog(uiScene, innerSizer);
  }
  innerSizer.layout();
  return innerSizer;
};

const populateDeleteDialog = (uiScene: UIScene, innerSizer) => {
  let title = uiScene.rexUI.add.label({
    orientation: 'x',
    text: uiScene.add.text(0, 0, 'Are you sure you want to delete this?', {
      fontSize: 18,
      fontFamily: 'Arial',
      resolution: 2,
      wordWrap: { width: 300, useAdvancedWrap: false }
    })
  });
  const buttons = uiScene.rexUI.add.buttons({
    anchor: {
      left: 'left+10',
      centerY: 'center'
    },
    orientation: 'x',
    buttons: [createButton(uiScene, 'Yes'), createButton(uiScene, 'No')],
    space: 20
  });
  buttons.on('button.click', function(button, index, pointer, event) {
    console.log(`Click button-${button.test}`);
  });
  innerSizer.addSpace(1);
  innerSizer.add(title, 0, 'center', 7, false, 'confirmationText');
  innerSizer.add(buttons, 0, 'center', 7, false, 'deleteDialog');
  innerSizer.addSpace(1);
};

const createButton = (uiScene: UIScene, text) => {
  return uiScene.rexUI.add.label({
    width: 80,
    height: 40,
    background: uiScene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_LIGHT).setStrokeStyle(2, 0x000000),
    text: uiScene.add.text(0, 0, text, {
      fontSize: 18
    }),
    test: 'heywuddup',
    space: {
      left: 15,
      right: 10
    }
  });
};

const getMultipurposePanel = (): any => {
  if (!multipurposePanel) throw new Error('multipurposePanel not found');
  return multipurposePanel;
};

const hidePanel = (uiScene: UIScene) => {
  uiScene.rexUI.hide(multipurposePanel.getElement('textArea'));
  uiScene.rexUI.hide(multipurposePanel.getElement('title'));
  uiScene.rexUI.getTopmostSizer(multipurposePanel).layout();
};

const showPanel = (uiScene: UIScene) => {
  uiScene.rexUI.show(multipurposePanel.getElement('textArea'));
  uiScene.rexUI.show(multipurposePanel.getElement('title'));
  uiScene.rexUI.getTopmostSizer(multipurposePanel).layout();
};

export default {
  createMultipurposePanel,
  getMultipurposePanel,
  hidePanel,
  showPanel
};
