import ClientScene from '../../scenes/clientScene';
import GuiController, { getGuiController } from '../../controllers/guiController';
import Entity from './entity';

export class Building extends Entity {
  private guiController: GuiController;
  private _rectangle: Phaser.GameObjects.Rectangle;
  private static FILL_COLOR = 0xffffff;
  private static DEFAULT_COLOR = 0x888888;
  private static SELECTED_COLOR = 0x0000ff;
  public description: string = 'Building';
  public clientScene: ClientScene;

  constructor(scene: ClientScene, position: { x; y }, id: string, ownerId: string) {
    super(scene, 'building', ownerId, id);
    const { x, y } = position;
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
    });
    this._rectangle.on('pointerout', () => {
      scene.mouseOffEvent(this);
    });

    scene.buildings.add(this);
  }

  public selectedEvent() {
    this._rectangle.strokeColor = Building.SELECTED_COLOR;
    this.guiController.setSelectedEntityText(`${this.description}, ID: ${this.id}`);
    return this;
  }
  public deselectedEvent() {
    this._rectangle.strokeColor = Building.DEFAULT_COLOR;
    this.guiController.setSelectedEntityText('');
    return this;
  }

  get rectangle() {
    return this._rectangle;
  }
  public remove() {
    this._rectangle.destroy();
  }
}

export namespace Building {
  export const enum Types {
    TEST = 'test',
    TEST2 = 'test2',
    BARRACKS = 'barracks',
    HOME_BASE = 'homeBase',
    MINER = 'miner',
    REPAIR_DRONE_FACTORY = 'repairDroneFactory'
  }
}
