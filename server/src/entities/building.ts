import MainScene from '../scenes/mainScene';

class Building extends Phaser.GameObjects.GameObject {
  private _rectangle: Phaser.GameObjects.Rectangle;

  // private ID: number;
  private static FILL_COLOR = 0xffffff;
  private static STROKE_COLOR = 0x888888;

  public description: string = 'Building';

  constructor(scene: MainScene, x: number, y: number, width?: number, height?: number) {
    super(scene, 'building');
    this._rectangle = scene.add.rectangle(x, y, width, height, Building.FILL_COLOR);
    this._rectangle.setInteractive();
    this._rectangle.setDataEnabled();
    this._rectangle.name = 'delete this';
    this._rectangle.setData('selected', true);
    this._rectangle.setData('owner', this);
    this._rectangle.setStrokeStyle(3, 0x888888);
    this._rectangle.on('changedata-selected', (gameObject: Phaser.GameObjects.GameObject, value: any) => {
      if (gameObject.getData('selected')) {
        this._rectangle.strokeColor = 0xaa0000;
      } else {
        this._rectangle.strokeColor = Building.STROKE_COLOR;
      }
    });
    this._rectangle.on('pointerover', () => {
      this._rectangle.setData('selected', true);
    });
    this._rectangle.on('pointerout', () => {
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
