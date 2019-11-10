// import MainScene from '../scenes/mainScene';

class Entity {
  public id: string;

  public onCollision() {
    console.log(this.id + ' COLLIDING');
  }
  public onDestroyed() {}
}

export default Entity;
