import ClientScene from '../../scenes/clientScene';
import { Utils } from '../../utils/utils';
import Entity from './entity';

export class Building extends Entity implements Damagable {
  private static readonly HEALTH_BAR_FILL_COLOR = 0x00dd33;
  public healthBarHeight;
  public healthBarWidth;
  public maxHealth: number = 1000; // change later to come from building type data
  public currentHealth: number;
  public healthBar: Phaser.GameObjects.Graphics;
  _shape: Phaser.GameObjects.Rectangle;
  private static FILL_COLOR = 0xffffff;
  private static DEFAULT_COLOR = 0x888888;
  private static SELECTED_COLOR = 0x0000ff;
  public DESCRIPTION: string = 'Building';
  public clientScene: ClientScene;

  constructor(scene: ClientScene, position: { x; y }, id: string, ownerId: string, health: number = 500) {
    super(scene, 'building', ownerId, id);
    const { x, y } = position;
    this.clientScene = scene;
    // this.guiController = getGuiController();
    this._shape = scene.add.rectangle(x, y, 50, 50, Building.FILL_COLOR);
    this.currentHealth = health;
    this.healthBarWidth = this._shape.width;
    this.healthBarHeight = this._shape.width / 6;
    this.initHealthBar();
    this._shape.setInteractive();
    this._shape.setDataEnabled();
    this._shape.setData('selected', true);
    this._shape.setData('owner', this);

    // this._shape.setStrokeStyle(3, 0x888888);

    this._shape.on('pointerover', () => {
      scene.mouseOverEvent(this);
    });
    this._shape.on('pointerout', () => {
      scene.mouseOffEvent(this);
    });

    scene.buildings.add(this);
  }

  public selectedEvent() {
    // this._shape.strokeColor = Building.SELECTED_COLOR;
    Utils.uiScene(this.scene.game).setSelectedEntityText(`${this.DESCRIPTION}, ID: ${this.id}`);
    return this;
  }
  public deselectedEvent() {
    // this._shape.strokeColor = Building.DEFAULT_COLOR;
    Utils.uiScene(this.scene.game).setSelectedEntityText('');
    return this;
  }

  get rectangle() {
    return this._shape;
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
    this.healthBar.x = this._shape.x;
    this.healthBar.y = this._shape.y;
    this.healthBar.fillStyle(Building.HEALTH_BAR_FILL_COLOR, 1);
    this.healthBar.fillRect(
      -this._shape.width / 2,
      this._shape.height / 2 + 10,
      this.healthBarWidth * (this.currentHealth / this.maxHealth),
      this.healthBarHeight
    );
    this.healthBar.lineStyle(2, 0xffffff);
    this.healthBar.strokeRect(
      -this._shape.width / 2,
      this._shape.height / 2 + 10,
      this.healthBarWidth,
      this.healthBarHeight
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
    this.healthBar.destroy();
    this._shape.destroy();
    this.destroy();
  }

  getPosition() {
    return this._shape.getCenter();
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
