import UIPlugin from '../../vendorModules/rex-ui/templates/ui/ui-plugin';
type rexUi = UIPlugin;

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

class TestScene extends Phaser.Scene {
  [rexUi: string]: rexUi;
  public mainPanel;
  constructor() {
    super({ key: 'testScene', active: true, visible: true });
  }

  create() {
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

    let mainSizer = createPanel(this, data);
    mainSizer.layout();
  }
}

var createPanel = function(scene, data) {
  var sizer = scene.rexUI.add
    .sizer({
      x: 500,
      y: 500,
      orientation: 'x'
    })
    .addBackground(scene.rexUI.add.roundRectangle(0, 0, 2, 2, 0, COLOR_PRIMARY))
    .add(
      createHeader(scene, data), // child
      0, // proportion
      'top', // align
      {
        right: 8
      }, // paddingConfig
      true // expand
    )
    .add(
      createTable(scene, data, 'skills', 1), // child
      0, // proportion
      'top', // align
      {
        right: 8
      }, // paddingConfig
      true // expand
    )
    .add(
      createTable(scene, data, 'items', 2), // child
      0, // proportion
      'top', // align
      0, // paddingConfig
      true // expand
    );
  return sizer;
};

var createHeader = function(scene, data) {
  var title = scene.rexUI.add.label({
    orientation: 'x',
    text: scene.add.text(0, 0, 'Character')
  });
  var header = scene.rexUI.add.label({
    orientation: 'y',
    icon: scene.rexUI.add.roundRectangle(0, 0, 100, 100, 5, COLOR_LIGHT),
    text: scene.add.text(0, 0, data.name),

    space: {
      icon: 10
    }
  });

  return scene.rexUI.add
    .sizer({
      orientation: 'y'
    })
    .addBackground(scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, undefined).setStrokeStyle(2, COLOR_LIGHT, 1))
    .add(
      title, // child
      0, // proportion
      'left', // align
      5, // paddingConfig
      true // expand
    )
    .add(
      header, // child
      1, // proportion
      'center', // align
      5, // paddingConfig
      true // expand
    );
};

var createTable = function(scene, data, key, rows) {
  var capKey = key.charAt(0).toUpperCase() + key.slice(1);
  var title = scene.rexUI.add.label({
    orientation: 'x',
    text: scene.add.text(0, 0, capKey)
  });

  var items = data[key];
  var columns = Math.ceil(items.length / rows);
  var table = scene.rexUI.add.gridSizer({
    column: columns,
    row: rows,

    rowProportions: 1
  });

  var item, r, c;
  var iconSize = rows === 1 ? 80 : 40;
  for (var i = 0, cnt = items.length; i < cnt; i++) {
    item = items[i];
    r = i % rows;
    c = (i - r) / rows;
    item.category = key;
    table.add(createIcon(scene, item, iconSize, iconSize), c, r, 'top', 2, true);
    delete item.category;
  }

  return scene.rexUI.add
    .sizer({
      orientation: 'y'
    })
    .addBackground(scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, undefined).setStrokeStyle(2, COLOR_LIGHT, 1))
    .add(
      title, // child
      0, // proportion
      'left', // align
      5, // paddingConfig
      true // expand
    )
    .add(
      table, // child
      1, // proportion
      'center', // align
      5, // paddingConfig
      true // expand
    );
};

var createIcon = function(scene, item, iconWidth, iconHeight) {
  var label = scene.rexUI.add.label({
    orientation: 'y',
    icon: scene.rexUI.add.roundRectangle(0, 0, iconWidth, iconHeight, 5, COLOR_LIGHT),
    text: scene.add.text(0, 0, item.name),

    space: {
      icon: 10
    }
  });

  let category = item.category;
  let name = item.name;
  label
    .getElement('icon')
    .setInteractive()
    .on('pointerdown', function() {
      if (!scene.rexUI.getTopmostSizer(this).isInTouching()) {
        return;
      }
      scene.print.text += `${category}:${name}\n`;
    });

  return label;
};

export default TestScene;
