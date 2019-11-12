import ClientScene from '../../scenes/clientScene';
import GuiController, { getGuiController } from '../../controllers/guiController';
import Entity from './entity';

export class Building extends Entity implements Damagable {
  private static readonly HEALTH_BAR_FILL_COLOR = 0x00dd33;
  public healthBarHeight;
  public healthBarWidth;
  public maxHealth: number = 1000; // change later to come from building type data
  public currentHealth: number;
  public healthBar: Phaser.GameObjects.Graphics;
  private guiController: GuiController;
  private _rectangle: Phaser.GameObjects.Rectangle;
  private static readonly FILL_COLOR = 0xffffff;
  private static readonly DEFAULT_COLOR = 0x888888;
  private static readonly SELECTED_COLOR = 0x0000ff;
  public description: string = 'Building';
  public clientScene: ClientScene;

  constructor(scene: ClientScene, position: { x; y }, id: string, ownerId: string, health: number = 500) {
    super(scene, 'building', ownerId, id);
    const { x, y } = position;
    this.clientScene = scene;
    this.guiController = getGuiController();
    this._rectangle = scene.add.rectangle(x, y, 50, 50, Building.FILL_COLOR);
    this.currentHealth = health;
    this.healthBarWidth = this._rectangle.width;
    this.healthBarHeight = this._rectangle.width / 6;
    this.initHealthBar();
    this._rectangle.setInteractive();
    this._rectangle.setDataEnabled();
    this._rectangle.setData('selected', true);
    this._rectangle.setData('owner', this);
    this._rectangle.setStrokeStyle(3, 0x888888);

    this._rectangle.on('pointerover', () => {
      scene.mouseOverEvent(this);
    });
    this._rectangle.on('pointerout', () => {
      scene.mouseOffEvent(this);
    });

    scene.buildings.add(this);
  }

  public selectedEvent() {
    this._rectangle.strokeColor = Building.SELECTED_COLOR;
    this.guiController.setSelectedEntityText(`${this.description}, ID: ${this.id}`);
    return this;
  }
  public deselectedEvent() {
    this._rectangle.strokeColor = Building.DEFAULT_COLOR;
    this.guiController.setSelectedEntityText('');
    return this;
  }

  get rectangle() {
    return this._rectangle;
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
    this.healthBar.fillStyle(Building.HEALTH_BAR_FILL_COLOR, 1);
    this.healthBar.fillRect(
      -this._rectangle.width / 2,
      this._rectangle.height / 2 + 10,
      this.healthBarWidth * (this.currentHealth / this.maxHealth),
      this.healthBarHeight
    );
    this.healthBar.lineStyle(2, 0xffffff);
    this.healthBar.strokeRect(
      -this._rectangle.width / 2,
      this._rectangle.height / 2 + 10,
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
    this._rectangle.destroy();
    this.destroy();
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
