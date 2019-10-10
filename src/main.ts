const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game'
};

class GameScene extends Phaser.Scene {
  private square: Phaser.GameObjects.Rectangle & {
    body: Phaser.Physics.Arcade.Body;
  };
  private debugText: Phaser.GameObjects.Text;
  private mousePointerText: Phaser.GameObjects.Text;

  constructor() {
    super(sceneConfig);
    console.log('anotherone');
  }

  public create() {
    this.square = this.add.rectangle(400, 400, 100, 100, 0xffffff) as any;
    this.debugText = this.add.text(20, 20, 'Testing', { fontSize: '20px' });
    this.mousePointerText = this.add.text(20, 100, 'Testing', {
      fontSize: '20px'
    });
    this.physics.add.existing(this.square);
  }

  public update() {
    const cursorKeys = this.input.keyboard.createCursorKeys();
    this.debugText.setText(
      `x: ${Math.round(this.square.getCenter().x)}, y: ${Math.round(
        this.square.getCenter().y
      )}`
    );
    this.mousePointerText.setText(
      `x: ${Math.round(this.input.mousePointer.x)}, y: ${Math.round(
        this.input.mousePointer.y
      )}`
    );

    if (cursorKeys.up.isDown) {
      this.square.body.setVelocityY(-500);
    } else if (cursorKeys.down.isDown) {
      this.square.body.setVelocityY(500);
    } else {
      this.square.body.setVelocityY(0);
    }

    if (cursorKeys.right.isDown) {
      this.square.body.setVelocityX(500);
    } else if (cursorKeys.left.isDown) {
      this.square.body.setVelocityX(-500);
    } else {
      this.square.body.setVelocityX(0);
    }
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'RTS Game',
  input: { mouse: true },
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  scene: GameScene,
  parent: 'game',
  backgroundColor: '#000'
};

const game = new Phaser.Game(gameConfig);
