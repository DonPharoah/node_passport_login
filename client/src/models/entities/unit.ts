import ClientScene from '../../scenes/clientScene';
import { getGuiController } from '../../controllers/guiController';
import Building from './building';
import Entity from './entity';

class Unit extends Entity {
  private _target: Building;
  private _rectangle: Phaser.GameObjects.Rectangle & {
    body: Phaser.Physics.Arcade.Body;
  };
  public readonly ownerId: string;
  private static FILL_COLOR = 0xffffff;

  constructor(scene: ClientScene, x: number, y: number, id: string, ownerId: string, target?: Building) {
    super(scene, 'unit', ownerId, id);
    this._rectangle = scene.add.rectangle(x, y, 10, 10, Unit.FILL_COLOR).setStrokeStyle(1, 0x999999) as any;
    scene.physics.add.existing(this._rectangle);
    this._target = target;
    const targetPosition = this._target.rectangle.getCenter();
    const currentPosition = this._rectangle.getCenter();
    const distance = targetPosition.subtract(currentPosition);
    scene.units.add(this);
  }
  selectedEvent() {
    return this;
  }
  deselectedEvent() {
    return this;
  }
  //public update() {}
}

export default Unit;
