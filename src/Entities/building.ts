import GameScene from '../main';
import * as short from 'short-uuid';
const uuid = short();

class Building {
  private _rectangle: Phaser.GameObjects.Rectangle;
  // private ID: number;
  private static FILL_COLOR = 0xffffff;
  private static STROKE_COLOR = 0x888888;

  public description: string = 'Building';
  private myPrivate: string;
  constructor(scene: GameScene, x: number, y: number, width?: number, height?: number) {
    this._rectangle = scene.add.rectangle(x, y, width, height, Building.FILL_COLOR);
    this._rectangle.setInteractive();
    this._rectangle.setDataEnabled();
    this._rectangle.name = uuid.generate();
    this._rectangle.setData('selected', true);
    this._rectangle.setData('owner', this);
    this._rectangle.setStrokeStyle(3, 0x888888);
    this._rectangle.on('changedata-selected', (gameObject: Phaser.GameObjects.Rectangle, value: any) => {
      if (gameObject.getData('selected')) {
        this._rectangle.strokeColor = 0xaa0000;
      } else {
        this._rectangle.strokeColor = Building.STROKE_COLOR;
      }
    });
    this._rectangle.on('pointerover', () => {
      scene.debugText.setText(`${this.description} ${this._rectangle.name}`);
      this._rectangle.setData('selected', true);
      scene.wilhelm.play();
    });
    this._rectangle.on('pointerout', () => {
      scene.debugText.setText('Nothing selected');
      this._rectangle.setData('selected', false);
    });

    // this.ID = Phaser.Math.Between(1, 100);
    scene.buildings.add(this._rectangle);
  }

  get rectangle() {
    return this._rectangle;
  }
}
export default Building;
