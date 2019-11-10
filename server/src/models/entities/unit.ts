import Building from './building';
import { Engine, World, Bodies, Body, Vector } from 'matter-js';
import { getSeed } from '../../utils/seed';
import Entity from './entity';
import ServerScene from '../../scenes/serverScene';

class Unit extends Entity {
  public readonly body: Body;
  private _target: Building;
  public readonly ownerId: string;

  constructor(scene: ServerScene, position: Vector, radius, ownerId: string, target: Building) {
    super();
    const { x, y } = position;
    const seed = getSeed();
    this.ownerId = ownerId;
    this.body = Bodies.circle(x, y, radius, { isSensor: true, frictionAir: 0 });
    // @ts-ignore
    this.body.ownerEntity = this;
    // @ts-ignore
    this.body.onCollision = (collidedObject) => {
      console.log(`COLLISION: UNIT ${this.id} AND BUILDING ${collidedObject.ownerEntity.ownerId}`);
      if (collidedObject.ownerEntity.ownerId !== this.ownerId) {
        scene.removeUnit(this.id);
      } else {
        //Body.setVelocity(this.body, { x: 0, y: 0 });
      }
    };
    this._target = target;

    this.id = seed.generate();
    if (target) {
      const targetPosition = this._target.body.position;
      const currentPosition = this.body.position;
      const distance = Vector.sub(targetPosition, currentPosition);
      //console.log("setting body's velocity...");
      Body.setVelocity(this.body, Vector.div(distance, 100));
    } else {
      //Body.setVelocity(this.body, { x: 10, y: 20 });
    }
  }
}

export default Unit;
