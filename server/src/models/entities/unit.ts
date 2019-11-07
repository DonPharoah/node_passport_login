import Building from './building';
import { Engine, World, Bodies, Body, Vector } from 'matter-js';
import { getSeed } from '../../utils/seed';
import Entity from './entity';

class Unit extends Entity {
  public readonly body: Body;
  private _target: Building;
  public readonly ownerId: string;

  constructor(position: Vector, radius, ownerId: string, target: Building) {
    super();
    const { x, y } = position;
    const seed = getSeed();
    this.ownerId = ownerId;
    this.body = Bodies.circle(x, y, radius);
    this._target = target;
    this.id = seed.generate();
    if (target) {
      const targetPosition = this._target.body.position;
      const currentPosition = this.body.position;
      const distance = Vector.sub(targetPosition, currentPosition);
      Body.setVelocity(this.body, distance);
    } else {
      Body.setVelocity(this.body, { x: 10, y: 20 });
    }
  }
}

export default Unit;
