import ClientScene from '../../scenes/clientScene';
import * as HealthBar from '../../../vendorModules/healthbar/HealthBar.js';
import { getGuiController } from '../../controllers/guiController';
import { Building } from './building';
import Entity from './entity';

export class Unit extends Entity implements Damagable {
  public health: number;
  public healthBar: HealthBar;
  private _target: Building;
  private _rectangle: Phaser.GameObjects.Rectangle & {
    body: Phaser.Physics.Arcade.Body;
  };
  public readonly ownerId: string;
  private static FILL_COLOR = 0xffffff;
  private clientScene: ClientScene;

  constructor(
    scene: ClientScene,
    position: { x; y },
    id: string,
    ownerId: string,
    target?: Building,
    hasHealthBar?: any
  ) {
    super(scene, 'unit', ownerId, id);
    this.clientScene = scene;
    this._rectangle = scene.add
      .rectangle(position.x, position.y, 10, 10, Unit.FILL_COLOR)
      .setStrokeStyle(1, 0x999999) as any;
    this.initHealthBar();
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
  public initHealthBar(barConfig: BarConfig = { x: this._rectangle.x + 30, y: this._rectangle.y + 30 }) {
    this.healthBar = new HealthBar(this.clientScene.game, barConfig);
    this.healthBar.setPercent(100);
  }
  public onDamage() {}
  public onDestroy() {}
  public remove() {
    this._rectangle.destroy();
  }
}

export namespace Unit {
  export const enum Types {
    TEST = 'test'
  }
}
