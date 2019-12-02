import ClientScene from '../../scenes/clientScene';
// import { getGuiController } from '../../controllers/guiController';
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
  _shape: Phaser.GameObjects.Rectangle;
  public readonly ownerId: string;
  public readonly DESCRIPTION = 'Unit';
  private static FILL_COLOR = 0xffffff;
  private clientScene: ClientScene;
  private _container: Phaser.GameObjects.Container;

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
    this._container = scene.add.container(position.x, position.y);
    this._shape = scene.add.rectangle(0, 0, 10, 10, Unit.FILL_COLOR);
    this._container.add(this._shape);
    this.currentHealth = health;
    this.healthBarWidth = 35;
    this.healthBarHeight = this._shape.width / 7;
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
    this._container.setPosition(x, y);
  }
  get rectangle() {
    return this._shape;
  }
  public initHealthBar() {
    this.healthBar = this.clientScene.add.graphics();
    this._container.add(this.healthBar);
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
    this.healthBar.x = this._shape.x;
    this.healthBar.y = this._shape.y;
    this.healthBar.fillStyle(Unit.HEALTH_BAR_FILL_COLOR, 1);
    this.healthBar.fillRect(
      -this._shape.width / 2,
      this._shape.height / 2 + 10,
      this.healthBarWidth * (this.currentHealth / this.maxHealth),
      10
    );
    this.healthBar.lineStyle(2, 0xffffff);
    this.healthBar.strokeRect(-this._shape.width / 2, this._shape.height / 2 + 10, this.healthBarWidth, 10);
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
    this.healthBar.destroy();
    this._shape.destroy();
    this.destroy();
  }

  getPosition() {
    return this._container;
  }
}

export namespace Unit {
  export const enum Types {
    TEST = 'test'
  }
}
