import ClientScene from '../scenes/clientScene';
import * as short from 'short-uuid';
const uuid = short();
declare let GameObject: Phaser.GameObjects.GameObject;

class Building extends Phaser.GameObjects.GameObject implements Selectable {
  private _rectangle: Phaser.GameObjects.Rectangle;
  private ownerId: string;
  // private ID: number;
  private static FILL_COLOR = 0xffffff;
  private static STROKE_COLOR = 0x888888;

  public description: string = 'Building';
  public clientScene: ClientScene;

  constructor(scene: ClientScene, x: number, y: number, id: string, ownerId: string) {
    super(scene, 'building');
    this.clientScene = scene;
    this._rectangle = scene.add.rectangle(x, y, 50, 50, Building.FILL_COLOR);
    this._rectangle.setInteractive();
    this._rectangle.setDataEnabled();
    this.ownerId = ownerId;
    this._rectangle.name = id;
    this._rectangle.setData('selected', true);
    this._rectangle.setData('owner', this);
    this._rectangle.setStrokeStyle(3, 0x888888);

    this._rectangle.on('pointerover', () => {
      scene.mouseOverEvent(this);
      this._rectangle.strokeColor = 0xaa0000;
      //scene.wilhelm.play();
    });
    this._rectangle.on('pointerout', () => {
      scene.mouseOffEvent(this);
      this._rectangle.strokeColor = Building.STROKE_COLOR;
    });

    // this.ID = Phaser.Math.Between(1, 100);
    scene.buildings.add(this._rectangle);
  }

  public selectedEvent() {
    this._rectangle.strokeColor = 0x0000ff;
    this.clientScene.debugText.setText(`Selected: ${this.description}`);
    return this;
  }
  public deselectedEvent() {
    this._rectangle.strokeColor = 0xaa0000;
    return this;
  }

  get rectangle() {
    return this._rectangle;
  }
}
export default Building;
