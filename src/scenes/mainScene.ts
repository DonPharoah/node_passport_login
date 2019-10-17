import Building from '../entities/building';
import Unit from '../entities/unit';
import debugGui from '../utils/debugGui';

class MainScene extends Phaser.Scene {
  private square: Phaser.GameObjects.Rectangle & {
    body: Phaser.Physics.Arcade.Body;
  };
  private testBuilding: Building;
  public howie: Phaser.Sound.BaseSound;
  public wilhelm: Phaser.Sound.BaseSound;
  public debugText: Phaser.GameObjects.Text;
  public mousePointerText: Phaser.GameObjects.Text;
  public buildings: Phaser.GameObjects.Group;

  constructor() {
    super({ key: 'mainScene', active: true });
  }
  public preload() {
    this.load.audio('howie', '../assets/sounds/howie-scream.mp3');
    this.load.audio('wilhelm', '../assets/sounds/wilhelm-scream.mp3');
  }
  public create() {
    this.howie = this.sound.add('howie', { volume: 0.3 });
    this.wilhelm = this.sound.add('wilhelm', { volume: 0.3 });
    this.square = this.add.rectangle(400, 400, 100, 100, 0xffffff) as any;
    this.debugText = this.add.text(20, 20, 'Testing', { fontSize: '20px' });
    this.mousePointerText = this.add.text(20, 50, 'Testing', {
      fontSize: '20px'
    });
    this.physics.add.existing(this.square);
    this.buildings = this.add.group([], {
      name: 'buildings',
      key: 'building'
    });
    this.testBuilding = new Building(this, 100, 100, 50, 50);

    this.input.on('pointerdown', (pointer) => {
      new Unit(this, this.input.mousePointer.x, this.input.mousePointer.y, this.testBuilding);
      this.howie.play();
    });
  }

  public update() {
    const cursorKeys = this.input.keyboard.createCursorKeys();
    this.mousePointerText.setText(
      `x: ${Math.round(this.input.mousePointer.x)}, y: ${Math.round(this.input.mousePointer.y)}`
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
export default MainScene;
