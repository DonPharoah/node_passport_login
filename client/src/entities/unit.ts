import ClientScene from '../scenes/clientScene';
import Building from './building';
import * as short from 'short-uuid';
const uuid = short();
import Entity from './entity';
import { brotliDecompressSync } from 'zlib';

class Unit extends Entity {
  private _target: Building;
  private _rectangle: Phaser.GameObjects.Rectangle & {
    body: Phaser.Physics.Arcade.Body;
  };
  public readonly ownerId: string;
  private static FILL_COLOR = 0xffffff;

  constructor(scene: ClientScene, x: number, y: number, id: string, ownerId: string, target?: Building) {
    super(scene, 'unit', ownerId, id);
    this._rectangle = scene.add.rectangle(x, y, 10, 10, Unit.FILL_COLOR) as any;
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
