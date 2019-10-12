import Building from './Entities/building';
import Unit from './Entities/unit';
import { GameObjects } from 'phaser';
import { Body } from './types/matter';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game'
};

/*
    ( uwu *pounces you* )

            ("`-''-/").___..--''"`-._        -- -
            `u  u  )   `-.  (     ).`-.__.`) ====-- -
            (_W_.)'  ._   )  `_   `\ ``-..-'   ==-- -
            ((((.-''  ((((.'\       \      --- -
                       -     "-_ _   \
      -                         / F   )
                    -     -    / / `--'
               -              / /
                    -        / /
             -            __/ /
                         /,-pJ
            -        _--"-L ||
                   ,"      "//
      -           /  ,-""".//\
                 /  /     // J____
                J  /     // L/----\
    .           F J     //__//^---'
      `     ___J  F    '----| |
           J---|  F         F F
     `. `   `--J  L        J  F
     .   .`     L J       J  F
        .  .    J  \    ,"  F
          .  `.` \  "--"  ,"
             ` ``."-____-"
             
*/
class GameScene extends Phaser.Scene {
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
    super(sceneConfig);
  }
  public preload() {
    this.load.audio('howie', '../assets/sounds/howie-scream.mp3');
    this.load.audio('wilhelm', '../assets/sounds/wilhelm-scream.mp3');
  }
  public create() {
    this.howie = this.sound.add('howie', { volume: 0.5 });
    this.wilhelm = this.sound.add('wilhelm', { volume: 0.5 });
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
      //new Building(this, this.input.mousePointer.x, this.input.mousePointer.y, 100, 100);
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

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'RTS Game',
  input: { mouse: true },
  width: 800,
  height: 600,
  type: Phaser.AUTO,
  audio: {
    disableWebAudio: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: GameScene,
  parent: 'game',
  backgroundColor: '#000'
};

const game = new Phaser.Game(gameConfig);

export default GameScene;
