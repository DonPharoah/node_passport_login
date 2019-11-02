class UIScene extends Phaser.Scene {
  [rexUi: string]: any;
  public testBtn: Phaser.GameObjects.Sprite;
  public row;
  public buttons: any;
  public text: Phaser.GameObjects.Text;
  constructor() {
    super({ key: 'uiScene', active: true, visible: true });
  }
  // preload() {
  //   this.load.image('testBtn', 'assets/ui/buttons/testBtn.png');
  // }
  create() {
    let gameWidth = Number(this.game.config.width);
    let gameHeight = Number(this.game.config.height);
    let buttons = this.rexUI.add
      .buttons({
        x: gameWidth / 2,
        y: gameHeight - 50,
        width: gameWidth,
        height: 300,
        anchor: {
          bottom: '0%+0'
        },
        orientation: 'left-to-right',
        // align: 'bottom',
        background: this.rexUI.add.roundRectangle(0, 0, 100, 100, 0, 0x3e2723).setStrokeStyle(3, 0x444444, 1),
        buttons: [
          this.createButton(this, '3'),
          this.createButton(this, '4'),
          this.createButton(this, '5'),
          this.createButton(this, '6')
        ],
        click: {
          mode: 'pointerup',
          clickInterval: 1000
        },
        space: 10
      })
      .layout();

    buttons
      .on('button.click', (button, index, pointer, event) => {
        console.log(`button ${index} pressed.`);
      })
      .on('button.over', (button, index, pointer, event) => {
        button.getElement('background').setStrokeStyle(1, 0xffffff);
      })
      .on('button.out', (button, index, pointer, event) => {
        button.getElement('background').setStrokeStyle();
      });
  }
  update() {}

  createButton(scene, text) {
    return scene.rexUI.add.label({
      width: 100,
      height: 100,
      background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x5e92f3),
      text: scene.add.text(0, 0, text, {
        fontSize: 16
      }),
      space: {
        left: 10,
        right: 10
        // top: 10,
        // bottom: 10
      }
    });
  }
}

export default UIScene;
