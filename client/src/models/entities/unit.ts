import ClientScene from '../../scenes/clientScene';
import { getGuiController } from '../../controllers/guiController';
import { Building } from './building';
import Entity from './entity';

export class Unit extends Entity implements Damagable {
  private static HEALTH_BAR_FILL_COLOR: number = 0x00dd33;
  public healthBarWidth: number;
  public healthBarHeight: number;
  public maxHealth: number = 1000; // change later to come from building type data
  public currentHealth: number;
  public healthBar: Phaser.GameObjects.Graphics;
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
    health: number = 500,
    target?: Building
  ) {
    super(scene, 'unit', ownerId, id);
    this.clientScene = scene;
    this._rectangle = scene.add
      .rectangle(position.x, position.y, 10, 10, Unit.FILL_COLOR)
      .setStrokeStyle(1, 0x999999) as any;
    // this.currentHealth = health;
    // this.healthBarWidth = 35;
    // this.healthBarHeight = this._rectangle.width / 7;
    // this.initHealthBar();
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
  public initHealthBar() {
    this.healthBar = this.clientScene.add.graphics();
    this.checkHealthAndRedraw();
  }
  public checkHealthAndRedraw() {
    if (this.currentHealth >= this.maxHealth) {
      this.currentHealth = this.maxHealth;
      this.healthBar.clear();
    } else if (this.currentHealth < this.maxHealth && this.currentHealth > 0) {
      this.redrawHealthBar();
    } else {
      this.remove();
    }
  }
  public redrawHealthBar() {
    this.healthBar.clear();
    this.healthBar.x = this._rectangle.x;
    this.healthBar.y = this._rectangle.y;
    this.healthBar.fillStyle(Unit.HEALTH_BAR_FILL_COLOR, 1);
    this.healthBar.fillRect(
      -this._rectangle.width / 2,
      this._rectangle.height / 2 + 10,
      this.healthBarWidth * (this.currentHealth / this.maxHealth),
      10
    );
    this.healthBar.lineStyle(2, 0xffffff);
    this.healthBar.strokeRect(
      -this._rectangle.width / 2,
      this._rectangle.height / 2 + 10,
      this.healthBarWidth,
      10
    );
    this.healthBar.setDepth(1);
  }
  public dealDamage(damageAmount: number) {
    this.currentHealth -= damageAmount;
    this.checkHealthAndRedraw();
  }
  public dealHealing(healingAmount: number) {
    this.currentHealth += healingAmount;
    this.checkHealthAndRedraw();
  }
  public setHealth(newHealth: number) {
    this.currentHealth = newHealth;
    this.checkHealthAndRedraw();
  }
  public remove() {
    // this.healthBar.destroy();
    this._rectangle.destroy();
    this.destroy();
  }
}

export namespace Unit {
  export const enum Types {
    TEST = 'test'
  }
}
