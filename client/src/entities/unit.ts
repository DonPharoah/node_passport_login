import ClientScene from '../scenes/clientScene';
import Building from './building';
import * as short from 'short-uuid';
const uuid = short();

class Unit implements Selectable {
  private _target: Building;
  private _rectangle: Phaser.GameObjects.Rectangle & {
    body: Phaser.Physics.Arcade.Body;
  };
  private static FILL_COLOR = 0xffffff;

  constructor(scene: ClientScene, x: number, y: number, target?: Building) {
    this._rectangle = scene.add.rectangle(x, y, 10, 10, Unit.FILL_COLOR) as any;
    scene.physics.add.existing(this._rectangle);
    this._target = target;
    const targetPosition = this._target.rectangle.getCenter();
    const currentPosition = this._rectangle.getCenter();
    const distance = targetPosition.subtract(currentPosition);
    this._rectangle.body.setVelocity(distance.x, distance.y);
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
