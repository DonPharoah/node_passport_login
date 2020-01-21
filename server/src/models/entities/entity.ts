// import MainScene from '../scenes/mainScene';

abstract class Entity {
  public id: string;
  public ownerId: string;
  public currentHealth: number;
  private destructionListeners = [];

  //public onCollision = () => {};
  //public onCollisionEnd = () => {};

  public addDestructionCallback(onDestroyed: () => void) {
    this.destructionListeners.push(onDestroyed);
  }

  public removeDestructionCallback(observer: () => void) {
    const removeIndex = this.destructionListeners.findIndex((obs) => {
      return observer === obs;
    });
    if (removeIndex !== -1) {
      this.destructionListeners = this.destructionListeners.slice(removeIndex, 1);
    }
  }

  public takeDamage(damage: number) {
    if (this.currentHealth > damage) {
      this.currentHealth = this.currentHealth - damage;
    } else {
      this.currentHealth = -1;
      this.takeDamage = () => {}; //TODO REMOVE
      this.destructionListeners.forEach((callback) => {
        callback();
      });
      this.destructionListeners = [];
      this.onDestroyedEvent();
    }
  }

  public abstract setOwner(newOwnerId: string);

  public abstract onDestroyedEvent();
  public abstract isDamagable();
}
export default Entity;
