import ClientScene from '../../scenes/clientScene';
import UIScene from '../../scenes/uiScene';
import buildingList from './ui-lists/buildings/buildingList';

type itemElement = { id: number; color: number };
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
const Random = Phaser.Math.Between;

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

const initGridTable = (scene: UIScene) => {
  let gameWidth = scene.game.config.width;
  let gameHeight = scene.game.config.height;
  var scrollMode = 1; // 0:vertical, 1:horizontal
  var gridTable = scene.rexUI.add
    .gridTable({
      // x: scene.game.config.width / 2,
      // y: gameHeight - 300,
      // width: scene.game.config.width,
      width: (scene.game.config.width as number) / 2,
      height: 230,
      anchor: {
        left: '0%',
        bottom: '100%'
      },
      scrollMode: scrollMode,
      background: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 0, COLOR_PRIMARY).setStrokeStyle(3, 0x352222),
      table: {
        cellWidth: 70,
        cellHeight: 70,
        columns: 2,
        mask: {
          padding: 10
        },
        reuseCellContainer: true
      },
      slider: {
        track: scene.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
        thumb: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT)
      },
      header: scene.rexUI.add.label({
        width: 30,
        height: undefined,
        orientation: scrollMode,
        background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0, COLOR_DARK),
        text: scene.add.text(0, 0, 'Unit Selection', { fontSize: 12 })
      }),
      footer: undefined,
      space: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 15,

        table: 20,
        header: 10
      },
      createCellContainerCallback: function(cell, cellContainer) {
        let width = cell.width,
          height = cell.height,
          item: BuildingSchema = cell.item,
          index = cell.index;
        if (cellContainer === null) {
          cellContainer = scene.rexUI.add.label({
            width: width,
            height: height,
            orientation: scrollMode,
            background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, COLOR_DARK),
            icon: scene.rexUI.add.roundRectangle(0, 0, 0, item.size, item.size, 0x0),
            text: scene.add.text(0, 0, item.name, { fontSize: 12 }),

            space: {
              icon: 10,
              left: scrollMode === 0 ? 15 : 0,
              top: scrollMode === 0 ? 0 : 15
            }
          });
          // console.log(cell.index + ': create new cell-container');
        } else {
          // console.log(cell.index + ': reuse cell-container');
        }

        // Set properties from item value
        cellContainer.setMinSize(width, height); // Size might changed in this demo
        // cellContainer.getElement('text').setText('Unit ' + item.name); // Set text of text object
        cellContainer
          .getElement('icon')
          .setFillStyle(item.color)
          .setStrokeStyle(2, COLOR_DARK); // Set fill color of round rectangle object
        return cellContainer;
      },
      items: buildingList,
      draggable: false
    })
    .layout();

  gridTable
    .on('cell.over', (cellContainer, cellIndex) => {
      cellContainer
        .getElement('background')
        .setStrokeStyle(2, COLOR_LIGHT)
        .setDepth(1);
    })
    .on('cell.out', (cellContainer, cellIndex) => {
      cellContainer
        .getElement('background')
        .setStrokeStyle(2, COLOR_DARK)
        .setDepth(0);
    })
    // .on('cell.click', function (cellContainer, cellIndex) {
    //     this.print.text += 'click ' + cellIndex + ': ' + cellContainer.text + '\n';
    // }, this)
    .on('cell.1tap', (cellContainer, cellIndex) => {
      // this.print.text += '1 tap (' + cellIndex + ': ' + cellContainer.text + ')\n';
    })
    .on('cell.2tap', (cellContainer, cellIndex) => {
      // this.print.text += '2 taps (' + cellIndex + ': ' + cellContainer.text + ')\n';
    })
    .on('cell.pressstart', (cellContainer, cellIndex) => {
      // this.print.text += 'press-start (' + cellIndex + ': ' + cellContainer.text + ')\n';
    })
    .on('cell.pressend', (cellContainer, cellIndex) => {
      console.log('cellContainer: ' + cellContainer);
    });
};

export default initGridTable;
