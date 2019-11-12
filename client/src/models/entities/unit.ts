import ClientScene from '../../scenes/clientScene';
import { getGuiController } from '../../controllers/guiController';
import { Building } from './building';
import Entity from './entity';

export class Unit extends Entity {
  private _target: Building;
  private _rectangle: Phaser.GameObjects.Rectangle & {
    body: Phaser.Physics.Arcade.Body;
  };
  public readonly ownerId: string;
  private static FILL_COLOR = 0xffffff;

  constructor(scene: ClientScene, position: { x; y }, id: string, ownerId: string, target?: Building) {
    super(scene, 'unit', ownerId, id);
    this._rectangle = scene.add
      .rectangle(position.x, position.y, 10, 10, Unit.FILL_COLOR)
      .setStrokeStyle(1, 0x999999) as any;

    scene.units.add(this);
  }
  selectedEvent() {
    return this;
  }
  deselectedEvent() {
    return this;
  }
  public setPosition({ x, y }) {
    this._rectangle.setPosition(x, y);
  }
  public remove() {
    this._rectangle.destroy();
  }
}

export namespace Unit {
  export const enum Types {
    TEST = 'test'
  }
}
