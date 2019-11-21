import ClientScene from '../../scenes/clientScene';
import { GameObjects } from 'phaser';

abstract class Entity extends Phaser.GameObjects.GameObject implements Selectable {
  public ownerId: string;
  public readonly id: string;
  abstract DESCRIPTION: string = 'Entity';
  abstract selectedEvent();
  abstract deselectedEvent();
  public abstract _shape: GameObjects.GameObject & {
    x;
    y;
  };
  abstract getPosition();

  constructor(scene: Phaser.Scene, type: string, ownerId: string, id: string) {
    super(scene, type);
    this.ownerId = ownerId;
    this.id = id;
  }

  public abstract remove();
}
export default Entity;
