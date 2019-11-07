abstract class Entity extends Phaser.GameObjects.GameObject implements Selectable {
  public readonly ownerId: string;
  public readonly id: string;
  abstract selectedEvent();
  abstract deselectedEvent();

  constructor(scene: Phaser.Scene, type: string, ownerId: string, id: string) {
    super(scene, type);
    this.ownerId = ownerId;
    this.id = id;
  }
}
export default Entity;
