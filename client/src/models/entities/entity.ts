import ClientScene from '../../scenes/clientScene';
import { GameObjects } from 'phaser';

export abstract class Entity extends Phaser.GameObjects.GameObject implements Selectable, Damagable {
  public ownerId: string;
  public readonly id: string;
  // abstract DESCRIPTION: string = 'Entity';
  public abstract selectedEvent(): Entity;
  public abstract deselectedEvent(): Entity;
  public abstract shape: GameObjects.GameObject & { x: number; y: number };
  public abstract getPosition(): { x; y };
  public currentHealth: number;
  public healthBar: GameObjects.Graphics;
  public healthBarWidth: number;
  public healthBarHeight: number;
  private destructionListeners: [] = []; // Possibly only for selection
  //
  public debugTooltip: GameObjects.Text;
  public debugTooltipText: string = this.id;

  constructor(scene: Phaser.Scene, position: { x; y }, type: string, ownerId: string, id: string) {
    super(scene, type);
    this.ownerId = ownerId;
    this.id = id;
    this.debugTooltipText = id;
    const { x, y } = position;
    this.debugTooltip = new GameObjects.Text(scene, x, y, this.debugTooltipText, {
      fontFamily: 'Verdana'
    });
  }

  public abstract initHealthBar(): void;
  public abstract checkHealthAndRedraw(): void;
  public abstract redrawHealthBar(): void;
  public abstract setHealth(newHealth: number): void;
  public abstract remove();
  public abstract getName(): string;

  public addDestructionListener(callback: () => {}) {}
  public removeDestructionListener() {}

  public setDebugTooltip(text: string) {
    this.debugTooltipText = `${this.id}\n${text}`;
    this.debugTooltip.setText(this.debugTooltipText);
  }
}
