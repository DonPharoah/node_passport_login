// import MainScene from '../scenes/serverScene';
import { Engine, World, Bodies, Body, Vector } from 'matter-js';
import { getSeed } from '../utils/seed';
import Entity from '../entities/entity';

class Building extends Entity {
  public readonly body: Body;
  public readonly ownerId: string;

  constructor(position: Vector, radius: number, ownerId: string) {
    super();
    const { x, y } = position;
    const seed = getSeed();
    this.ownerId = ownerId;
    this.id = seed.generate();
    this.body = Bodies.circle(x, y, radius, { isStatic: true });
  }
}
export default Building;
