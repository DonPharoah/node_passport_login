const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

class ButtonTest extends Phaser.Scene {
  constructor() {
    super({
      key: 'examples'
    });
  }

  preload() {}

  // working one vvv
  // create() {
  // let gameWidth = Number(this.game.config.width);
  // let gameHeight = Number(this.game.config.height);
  // let buttons = this.rexUI.add
  // .buttons({
  // x: gameWidth / 2,
  // y: gameHeight - 50,
  // width: gameWidth,
  // height: 50,
  // anchor: {
  // bottom: '0'
  // },
  // orientation: 'left-to-right',
  // align: 'left',
  // background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 0, 0x3e2723).setStrokeStyle(3, 0x444444, 1),
  // buttons: [
  // this.createButton(this, '3'),
  // this.createButton(this, '4'),
  // this.createButton(this, '5'),
  // this.createButton(this, '6')
  // ],
  // click: {
  // mode: 'pointerup',
  // clickInterval: 1000
  // },
  // space: 10,
  // name: 'test',
  // expand: false
  // })
  // .layout();

  // buttons
  // .on('button.click', (button, index, pointer, event) => {
  // console.log(`button ${index} pressed.`);
  // })
  // .on('button.over', (button, index, pointer, event) => {
  // button.getElement('background').setStrokeStyle(1, 0xffffff);
  // })
  // .on('button.out', (button, index, pointer, event) => {
  // button.getElement('background').setStrokeStyle();
  // });
  // }
  // ^^^^
  create() {
    var buttons = this.rexUI.add
      .buttons({
        anchor: {
          left: 'left+10',
          centerY: 'center'
        },

        orientation: 'y',

        buttons: [createButton(this, 'A'), createButton(this, 'B')]
      })
      .layout()
      .drawBounds(this.add.graphics(), 0xff0000);

    buttons.on('button.click', function(button, index, pointer, event) {
      console.log(`Click button-${button.text}`);
    });
  }

  update() {}
}

var createButton = function(scene, text) {
  return scene.rexUI.add.label({
    width: 100,
    height: 40,
    background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, COLOR_LIGHT),
    text: scene.add.text(0, 0, text, {
      fontSize: 18
    }),
    space: {
      left: 10,
      right: 10
    }
  });
};

export default ButtonTest;
