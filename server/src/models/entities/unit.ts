import Building from './building';
import { Engine, World, Bodies, Body, Vector } from 'matter-js';
import { getSeed } from '../../utils/seed';
import Entity from './entity';
import ServerScene from '../../scenes/serverScene';

class Unit extends Entity {
  public readonly body: Body;
  public readonly range: Body;
  private target: Building;
  private unitAI: UnitAI;
  private friendsInLOS = {};
  private enemiesInLOS = {};
  private attackTarget: Entity;
  private attackTimer;

  constructor(scene: ServerScene, position: Vector, radius, target: Building, returnTarget?: Building) {
    super();
    const { x, y } = position;
    const seed = getSeed();
    this.id = seed.generate();
    this.body = Bodies.circle(x, y, radius, { isSensor: true, frictionAir: 0 });
    // @ts-ignore
    this.body.ownerEntity = this;

    // @ts-ignore
    this.body.onCollision = (collidedObject) => {
      const collidingEntity = collidedObject.ownerEntity as Entity;
      if (collidedObject.ownerEntity.ownerId !== this.ownerId && collidedObject.ownerEntity.isDamagable()) {
        this.enemiesInLOS[collidingEntity.id] = collidingEntity;
        this.designateAttackTarget(scene, collidingEntity);
      } else {
        this.friendsInLOS[collidingEntity.id] = collidingEntity;
      }
    };
    // @ts-ignore
    this.body.onCollisionEnd = (collidedObject) => {
      // Called when line of sight ends, due to either target leaving range or being destroyed
      const targetEntity = collidedObject.ownerEntity as Entity;
      // If targetEntity was an enemy
      if (collidedObject.ownerEntity.ownerId !== this.ownerId) {
        delete this.enemiesInLOS[targetEntity.id];
        // If this unit was attacking targetEntity
        if (targetEntity == this.attackTarget) {
          // Remove attack observer and stop timer
          this.removeAttackTarget();
          // Look for other targets in range. Right now just target next in array, but later look through list and prioritize
          if (Object.keys(this.enemiesInLOS).length > 0) {
            const nextTargetKey = Object.keys(this.enemiesInLOS)[0];
            this.designateAttackTarget(scene, this.enemiesInLOS[nextTargetKey]);
          } else {
          }
        }
      } else {
        delete this.friendsInLOS[targetEntity.id];
      }
    };
    this.designateFollowTarget(scene, target, returnTarget);

    this.id = seed.generate();
    if (target) {
      const targetPosition = this.target.body.position;
      const currentPosition = this.body.position;
      const distance = Vector.sub(targetPosition, currentPosition);
      //console.log("setting body's velocity...");
      //Body.setVelocity(this.body, Vector.div(distance, 100));
      this.unitAI = new GotoAI(this, targetPosition, () => {
        this.unitAI = new OrbitAI(this.body.position, 60, this.target.body.position);
      });
    } else {
      //Body.setVelocity(this.body, { x: 10, y: 20 });
    }

    this.onDestroyedEvent = () => {
      // @ts-ignore
      this.body.onCollisionEnd = (collidedObject) => {};
      this.removeAttackTarget();
      scene.removeUnit(this.id);
    };
  }

  private designateFollowTarget(scene, moveTarget, returnTarget) {
    this.target = moveTarget;
    // If movement target is destroyed
    this.target.addDestructionCallback(() => {
      this.unitAI = new GotoAI(this, returnTarget.body.position, () => {
        this.unitAI = new OrbitAI(this.body.position, 60, returnTarget.body.position);
      });
    });
  }

  private removeAttackTarget() {
    this.attackTarget = null;
    clearInterval(this.attackTimer);
  }

  private designateAttackTarget(scene, target) {
    if (!this.attackTarget) {
      this.attackTarget = target;
      this.attackTimer = setInterval(() => {
        //console.log(targetBuilding.id);
        this.attackTarget.takeDamage(50);
        scene.updateEntityHealth(this.attackTarget, this);
      }, 1000);
      this.attackTarget.addDestructionCallback(() => {
        clearInterval(this.attackTimer);
      });
    }
  }

  public onDestroyedEvent;

  public updatePosition() {
    this.unitAI.update(this);
  }
  public isDamagable(): boolean {
    return true;
  }
  public setOwner(newOwnerId: string) {
    this.ownerId = newOwnerId;
    this.removeAttackTarget();
  }
} // end of Unit class

interface UnitAI {
  update(entity: Entity): void;
}

class GotoAI implements UnitAI {
  private onArrivalEvent = () => {};
  private targetPosition: { x; y };
  private self: Unit;

  constructor(self: Unit, targetPosition: { x; y }, onArrivalEvent?: () => void) {
    this.self = self;
    this.targetPosition = targetPosition;
    //const distance = Vector.sub(targetPosition, self.body.position);
    //const perpendicular = Vector.normalise(Vector.perp(distance));
    //const radius = Vector.mult(perpendicular, 100);
    //this.targetPosition = Vector.add(radius, targetPosition);
    //Body.setVelocity(this.self.body, Vector.div(distance, 100));
    if (onArrivalEvent) this.onArrivalEvent = onArrivalEvent;
  }

  public update() {
    const currentPosition = this.self.body.position;
    const distance = Vector.sub(this.targetPosition, currentPosition);
    Body.setVelocity(this.self.body, Vector.mult(Vector.normalise(distance), 2));
    if (Vector.magnitude(distance) <= 60) {
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
    this.angle += 0.03;
  }
}

export default Unit;
