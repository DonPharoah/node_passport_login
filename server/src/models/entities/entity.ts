// import MainScene from '../scenes/mainScene';

abstract class Entity {
  public id: string;
  public health: number = 1000;
  public maxHealth: number = 1000;
  private destructionListener = [];

  //public onCollision = () => {};
  //public onCollisionEnd = () => {};

  public addDestructionListener(onDestroyed: () => void) {
    this.destructionListener.push(onDestroyed);
  }

  public takeDamage(damage: number) {
    if (this.health > damage) {
      this.health = this.health - damage;
    } else {
      this.health = -1;
      this.takeDamage = () => {}; //TODO REMOVE
      this.destructionListener.forEach((callback) => {
        callback();
      });
      this.destructionListener = [];
      this.onDestroyedEvent();
    }
  }

  public abstract onDestroyedEvent();
}

export default Entity;
