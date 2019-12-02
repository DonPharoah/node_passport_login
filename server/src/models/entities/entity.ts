// import MainScene from '../scenes/mainScene';

abstract class Entity {
  public id: string;
  public health: number = 1000;
  public maxHealth: number = 1000;
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
    if (this.health > damage) {
      this.health = this.health - damage;
    } else {
      this.health = -1;
      this.takeDamage = () => {}; //TODO REMOVE
      this.destructionListeners.forEach((callback) => {
        callback();
      });
      this.destructionListeners = [];
      this.onDestroyedEvent();
    }
  }

  public abstract onDestroyedEvent();
  public abstract isDamagable();
}
export default Entity;
