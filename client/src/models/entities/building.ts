import ClientScene from '../../scenes/clientScene';
import GuiController, { getGuiController } from '../../controllers/guiController';
import * as short from 'short-uuid';
import Entity from './entity';

const uuid = short();

class Building extends Entity {
  private guiController: GuiController;
  private _rectangle: Phaser.GameObjects.Rectangle;
  private static FILL_COLOR = 0xffffff;
  private static STROKE_COLOR = 0x888888;
  public description: string = 'Building';
  public clientScene: ClientScene;

  constructor(scene: ClientScene, x: number, y: number, id: string, ownerId: string) {
    super(scene, 'building', ownerId, id);
    this.clientScene = scene;
    this.guiController = getGuiController();
    this._rectangle = scene.add.rectangle(x, y, 50, 50, Building.FILL_COLOR);
    this._rectangle.setInteractive();
    this._rectangle.setDataEnabled();
    this._rectangle.setData('selected', true);
    this._rectangle.setData('owner', this);
    this._rectangle.setStrokeStyle(3, 0x888888);

    this._rectangle.on('pointerover', () => {
      scene.mouseOverEvent(this);
      //this._rectangle.strokeColor = 0xaa0000;
      //scene.wilhelm.play();
    });
    this._rectangle.on('pointerout', () => {
      scene.mouseOffEvent(this);
      //this._rectangle.strokeColor = Building.STROKE_COLOR;
    });

    scene.buildings.add(this);
  }

  public selectedEvent() {
    this._rectangle.strokeColor = 0x0000ff;
    this.guiController.setSelectedEntityText(`${this.description}, ID: ${this.id}`);
    return this;
  }
  public deselectedEvent() {
    this._rectangle.strokeColor = 0x888888;
    this.guiController.setSelectedEntityText('');
    return this;
  }

  get rectangle() {
    return this._rectangle;
  }
}
export default Building;
