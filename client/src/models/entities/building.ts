import ClientScene from '../../scenes/clientScene';
import { Utils } from '../../utils/utils';
import { Entity } from './entity';
import buildingPresets from '../schemas/buildings/buildingPresets';
import { GameObjects, Game, Physics } from 'phaser';

// export declare type BuildingPresetConstants = 'HOME_BASE' | 'BARRACKS' | 'MINER' | 'REPAIR_DRONE_FACTORY';
export type BuildingPresetConstants = typeof Building.PresetConstants;

export class Building extends Entity implements Damagable {
  public static readonly PresetConstants: 'HOME_BASE' | 'BARRACKS' | 'MINER' | 'REPAIR_DRONE_FACTORY';
  private static readonly HEALTH_BAR_FILL_COLOR: number = 0x00dd33;
  private static FILL_COLOR: number = 0xffffff;
  private static DEFAULT_COLOR: number = 0x888888;
  private static SELECTED_COLOR: number = 0x0000ff;
  //public healthBarHeight: number; Already in Entity base class
  //public healthBarWidth: number;
  //public currentHealth: number;
  public shape: Phaser.GameObjects.Rectangle;
  public clientScene: ClientScene;
  public preset: BuildingSchema;

  constructor(
    scene: ClientScene,
    position: { x: number; y: number },
    id: string,
    ownerId: string,
    presetType: BuildingPresetConstants
  ) {
    super(scene, position, 'building', ownerId, id);
    const { x, y } = position;
    this.clientScene = scene;
    this.hydratePresetData(presetType);
    this.shape = Building.createBuildingShape(this.preset, scene, x, y);
    this.initHealthBar();
    this.shape.setInteractive();
    this.shape.setDataEnabled();
    this.shape.setData('selected', true);
    this.shape.setData('owner', this);

    // this.shape.setStrokeStyle(3, 0x888888);

    this.shape.on('pointerover', () => {
      scene.mouseOverEvent(this);
    });
    this.shape.on('pointerout', () => {
      scene.mouseOffEvent(this);
    });

    scene.buildings.add(this);
    //const zone = scene.add.circle(x, y, 50, Building.FILL_COLOR);
    scene.physics.add.existing(this.shape, true);
    scene.buildingPhysicsGroup.add(this.shape);
  }

  static createBuildingShape(buildingPreset: BuildingSchema, scene: ClientScene, x, y) {
    switch (buildingPreset.shape) {
      case 'CIRCLE':
        return scene.add.circle(x, y, 50, Building.FILL_COLOR);
      case 'RECTANGLE':
        return scene.add.rectangle(x, y, 80, 50, Building.FILL_COLOR);
      case 'SQUARE':
        return scene.add.rectangle(x, y, 50, 50, Building.FILL_COLOR);
      case 'TRIANGLE':
        return scene.add.triangle(x, y, 0, 40, 20, 0, 40, 40, Building.FILL_COLOR);
      default:
        console.log('ya fucked up');
    }
  }

  public selectedEvent() {
    // this._shape.strokeColor = Building.SELECTED_COLOR;
    // Utils.uiScene(this.scene.game).setSelectedEntityText(`${this.DESCRIPTION}, ID: ${this.id}`);
    return this;
  }

  public deselectedEvent() {
    // this._shape.strokeColor = Building.DEFAULT_COLOR;
    // Utils.uiScene(this.scene.game).setSelectedEntityText('');
    return this;
  }

  get rectangle() {
    return this.shape;
  }

  public initHealthBar() {
    this.currentHealth = this.preset.maxHealth;
    this.healthBarWidth = this.shape.width;
    this.healthBarHeight = this.shape.width / 6;
    this.healthBar = this.clientScene.add.graphics();
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
    this.healthBar.fillStyle(Building.HEALTH_BAR_FILL_COLOR, 1);
    this.healthBar.fillRect(
      -this.shape.width / 2,
      this.shape.height / 2 + 10,
      this.healthBarWidth * (this.currentHealth / this.preset.maxHealth),
      this.healthBarHeight
    );
    this.healthBar.lineStyle(2, 0xffffff);
    this.healthBar.strokeRect(
      -this.shape.width / 2,
      this.shape.height / 2 + 10,
      this.healthBarWidth,
      this.healthBarHeight
    );
    this.healthBar.setDepth(1);
  }

  public setHealth(newHealth: number) {
    this.currentHealth = newHealth;
    this.checkHealthAndRedraw();
  }

  public remove() {
    this.clientScene.buildingWasRemoved(this);
    this.healthBar.destroy();
    this.shape.destroy();
    this.destroy();
  }

  public getPosition(): { x: number; y: number } {
    return this.shape.getCenter();
  }

  public hydratePresetData(presetType: BuildingPresetConstants) {
    this.preset = { ...buildingPresets[presetType] };
  }

  public getName = () => `${this.preset.name} ${this.currentHealth}/${this.preset.maxHealth}`;
}
