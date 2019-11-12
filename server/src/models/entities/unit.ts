import Building from './building';
import { Engine, World, Bodies, Body, Vector } from 'matter-js';
import { getSeed } from '../../utils/seed';
import Entity from './entity';
import ServerScene from '../../scenes/serverScene';

class Unit extends Entity {
  public readonly body: Body;
  private _target: Building;
  public readonly ownerId: string;
  private unitAI: UnitAI;

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
        //scene.removeUnit(this.id);
        //this.unitAI = new orbitAI(100, this._target.body.position);
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
      //Body.setVelocity(this.body, Vector.div(distance, 100));
      this.unitAI = new GotoAI(this, targetPosition, () => {
        this.unitAI = new OrbitAI(this.body.position, 100, this._target.body.position);
      });
    } else {
      //Body.setVelocity(this.body, { x: 10, y: 20 });
    }
  }

  public updatePosition() {
    this.unitAI.update(this);
  }
}

interface UnitAI {
  update(entity: Entity): void;
}

class GotoAI implements UnitAI {
  private onArrivalEvent(): void {}
  private targetPosition: { x; y };
  private self: Unit;

  constructor(self: Unit, targetPosition: { x; y }, onArrivalEvent?: () => void) {
    this.onArrivalEvent = onArrivalEvent;
    this.self = self;
    this.targetPosition = targetPosition;
    //const distance = Vector.sub(targetPosition, self.body.position);
    //const perpendicular = Vector.normalise(Vector.perp(distance));
    //const radius = Vector.mult(perpendicular, 100);
    //this.targetPosition = Vector.add(radius, targetPosition);
    //Body.setVelocity(this.self.body, Vector.div(distance, 100));
  }

  public update() {
    const currentPosition = this.self.body.position;
    const distance = Vector.sub(this.targetPosition, currentPosition);
    Body.setVelocity(this.self.body, Vector.mult(Vector.normalise(distance), 2));
    if (Vector.magnitude(distance) <= 100) {
      this.onArrivalEvent();
    }
  }
}

class OrbitAI implements UnitAI {
  //TODO FAST TRIG APROOXIMATIONS
  private readonly origin: { x; y };
  private angle: number = 0;
  private radius;
  private readonly VELOCITY;
  constructor(entryPosition: { x; y }, radius: number, origin: { x; y }) {
    this.origin = origin;
    this.radius = radius;
    this.VELOCITY = (Math.PI * radius) / 2;
    const distance = Vector.sub(origin, entryPosition);
    const entryAngle = Math.atan2(distance.y, distance.x);
    this.angle = entryAngle + Math.PI;
  }
  update(unit: Unit) {
    const x = this.radius * Math.cos(this.angle) + this.origin.x;
    const y = this.radius * Math.sin(this.angle) + this.origin.y;
    Body.setPosition(unit.body, { x, y });
    this.angle += 0.01;
  }
}

export default Unit;
