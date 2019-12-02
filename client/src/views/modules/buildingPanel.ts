import UIScene from '../uiScene';
import buildingData from '../../models/schemas/buildings/buildingData';
type itemElement = { id: number; color: number };
const COLOR_PRIMARY = 0x5c6666;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x110119;
// const COLOR_PRIMARY = 0x4e342e;
// const COLOR_LIGHT = 0x7b5e57;
// const COLOR_DARK = 0x260e04;
let buildingPanel;
// const Random = Phaser.Math.Between;

// const getItems = (count): itemElement[] => {
//   var data: itemElement[] = [];
//   for (var i = 0; i < count; i++) {
//     data.push({
//       id: i,
//       color: Random(0, 0xffffff)
//     });
//   }
//   return data;
// };
const initBuildingPanel = (uiScene: UIScene) => {
  let title = uiScene.rexUI.add.label({
    orientation: 'x',
    text: uiScene.add.text(0, 0, 'Buildings', { fontSize: 18 })
  });
  buildingPanel = uiScene.rexUI.add
    .sizer({
      orientation: 'y'
    })
    // .addBackground(uiScene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_PRIMARY).setStrokeStyle(3, 0x352222))
    .add(title, 0, 'left', 3, true)
    .add(initGridTable(uiScene), 1, 'left', 5, true);
  return buildingPanel;
};

const initGridTable = (uiScene: UIScene) => {
  // guiController = getGuiController();
  let gameWidth = uiScene.game.config.width;
  let scrollMode = 1; // 0:vertical, 1:horizontal
  let gridTable = uiScene.rexUI.add.gridTable({
    // x: scene.game.config.width / 2,
    // y: gameHeight - 300,
    // width: scene.game.config.width,
    // width: (gameWidth as number) / 2,
    // width: 400,
    height: 200,
    // anchor: {
    //   left: '0%',
    //   bottom: '100%'
    // },
    scrollMode: scrollMode,
    background: uiScene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_PRIMARY).setStrokeStyle(3, 0x352222),
    table: {
      width: 200,
      cellWidth: 60,
      cellHeight: 60,
      columns: 3,
      mask: {
        padding: 0
      },
      // interactive: true,
      reuseCellContainer: true
    },
    // slider: {
    //   track: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
    //   thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT)
    // },
    space: {
      left: 10,
      right: 20,
      top: 10,
      bottom: 10,

      table: 10
    },
    createCellContainerCallback: function(cell, cellContainer) {
      let width = cell.width,
        height = cell.height,
        item: BuildingSchema = cell.item,
        index = cell.index;
      if (cellContainer === null) {
        cellContainer = uiScene.rexUI.add.label({
          width: width,
          height: height,
          orientation: scrollMode,
          background: uiScene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, COLOR_DARK),
          icon: uiScene.rexUI.add.roundRectangle(0, 0, 0, 0, item.size, undefined),
          // text: scene.add.text(0, 0, item.name, { fontSize: 12 }),

          space: {
            icon: 5,
            left: 5,
            right: 5,
            bottom: 0,
            top: 10
          }
        });
        // console.log(cell.index + ': create new cell-container');
      } else {
        // console.log(cell.index + ': reuse cell-container');
      }

      // Set properties from item value
      cellContainer.setMinSize(55, 55); // Size might changed in this demo
      // cellContainer.getElement('text').setText('Unit ' + item.name); // Set text of text object
      cellContainer
        .getElement('icon')
        .setFillStyle(item.color)
        .setStrokeStyle(2, 0x222222); // Set fill color of round rectangle object
      cellContainer.getElement('background').setFillStyle(0x888888);
      return cellContainer;
    },
    items: Object.values(buildingData),
    draggable: false
  });
  // .layout();

  initGridTableHandler(uiScene, gridTable);
  return gridTable;
};

function initGridTableHandler(uiScene: UIScene, gridTable) {
  gridTable
    .on('cell.over', (cellContainer, cellIndex) => {
      cellContainer.getElement('background').setStrokeStyle(2, 0xdddddd);
      uiScene.setTitleText(gridTable.items[cellIndex].name);
    })
    .on('cell.out', (cellContainer, cellIndex) => {
      cellContainer.getElement('background').setStrokeStyle(2, COLOR_DARK);
      uiScene.setTitleText('');
    })
    .on('cell.click', (cellContainer, cellIndex) => {
      console.log("running cell's callback...");
      gridTable.items[cellIndex].handler();
    });
}
export const getBuildingPanel = () => buildingPanel;
export { initBuildingPanel };
