import ClientScene from '../../scenes/clientScene';
import { Building } from './building';
import { Entity } from './entity';
import unitPresets from '../schemas/units/unitPresets';

// export type UnitPresetConstants = 'TEST' | 'DESTROYER';
export type UnitPresetConstants = typeof Unit.PresetConstants;

export class Unit extends Entity {
  public static readonly PresetConstants: 'TEST' | 'DESTROYER';
  private static HEALTH_BAR_FILL_COLOR: number = 0x00dd33;
  private static FILL_COLOR: number = 0xffffff;
  public healthBarWidth: number;
  public healthBarHeight: number;
  // public currentHealth: number;
  public healthBar: Phaser.GameObjects.Graphics;
  private target: Building;
  public shape: Phaser.GameObjects.Shape;
  public readonly ownerId: string;
  private clientScene: ClientScene;
  private container: Phaser.GameObjects.Container;
  public preset: UnitSchema;
  // public damageComponent: Damagable;

  constructor(
    scene: ClientScene,
    position: { x: number; y: number },
    id: string,
    ownerId: string,
    presetType: UnitPresetConstants
  ) {
    super(scene, position, 'unit', ownerId, id);
    // Object.assign(this, damageComponent);
    this.clientScene = scene;
    this.hydratePresetData(presetType);
    this.container = scene.add.container(position.x, position.y);

    // this.shape = scene.add.rectangle(0, 0, 10, 10, Unit.FILL_COLOR);
    this.shape = scene.add.triangle(0, 0, 10, 10, 20, 20, 30, 10, Unit.FILL_COLOR);
    this.container.add(this.shape);
    this.initHealthBar();
    scene.units.add(this);
    const debugRangeCircle = scene.add.circle(0, 0, this.preset.range, this.preset.fillColor, 0.1);
    this.container.add(debugRangeCircle);
  }

  public selectedEvent() {
    return this;
  }

  public deselectedEvent() {
    return this;
  }

  public setPosition({ x, y }) {
    this.container.setPosition(x, y);
  }

  get rectangle() {
    return this.shape;
  }

  public initHealthBar() {
    this.currentHealth = this.preset.maxHealth;
    this.healthBarWidth = 35;
    this.healthBarHeight = this.shape.width / 7;
    this.healthBar = this.clientScene.add.graphics();
    this.container.add(this.healthBar);
    this.checkHealthAndRedraw();
  }

  public checkHealthAndRedraw() {
    if (this.currentHealth >= this.preset.maxHealth) {
      this.currentHealth = this.preset.maxHealth;
      this.healthBar.clear();
    } else if (this.currentHealth < this.preset.maxHealth && this.currentHealth > 0) {
      this.redrawHealthBar();
    } else {
      this.remove();
    }
  }

  public redrawHealthBar() {
    this.healthBar.clear();
    this.healthBar.x = this.shape.x;
    this.healthBar.y = this.shape.y;
    this.healthBar.fillStyle(Unit.HEALTH_BAR_FILL_COLOR, 1);
    this.healthBar.fillRect(
      -this.shape.width / 2,
      this.shape.height / 2 + 10,
      this.healthBarWidth * (this.currentHealth / this.preset.maxHealth),
      10
    );
    this.healthBar.lineStyle(2, 0xffffff);
    this.healthBar.strokeRect(-this.shape.width / 2, this.shape.height / 2 + 10, this.healthBarWidth, 10);
    this.healthBar.setDepth(1);
  }

  public setHealth(newHealth: number) {
    this.currentHealth = newHealth;
    this.checkHealthAndRedraw();
  }

  public remove() {
    this.container.destroy();
    this.destroy();
  }

  public getPosition() {
    return this.container;
  }

  public hydratePresetData(presetType: UnitPresetConstants) {
    this.preset = { ...unitPresets[presetType] };
  }

  public getName = () => `${this.preset.name} ${this.currentHealth}/${this.preset.maxHealth}`;
}
