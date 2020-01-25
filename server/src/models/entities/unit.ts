import Building from './building';
import { Engine, World, Bodies, Body, Vector } from 'matter-js';
import { getSeed } from '../../utils/seed';
import Entity from './entity';
import ServerScene from '../../scenes/serverScene';
import { UnitAI, OrbitAI, GotoAI, IdleAI } from '../schemas/unitMovements';

class Unit extends Entity {
  public readonly body: Body;
  public readonly range: Body;
  private target: Building;
  private unitAI: UnitAI = new IdleAI();
  private friendsInLOS = {};
  private enemiesInLOS = {};
  private attackTarget: Entity;
  private attackTimer;

  constructor(scene: ServerScene, position: Vector, radius, target: Building, returnTarget?: Building) {
    super();
    const { x, y } = position;
    const seed = getSeed();
    this.currentHealth = 100;
    this.id = seed.generate();
    this.body = Bodies.circle(x, y, radius, { isSensor: true, frictionAir: 0 });
    // @ts-ignore
    this.body.ownerEntity = this;

    // @ts-ignore
    this.body.onCollision = (collidedObject) => {
      const collidingEntity = collidedObject.ownerEntity as Entity;
      if (collidedObject.ownerEntity.ownerId !== this.ownerId) {
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

    this.onDestroyedEvent = () => {
      // @ts-ignore
      this.body.onCollisionEnd = (collidedObject) => {};
      this.removeAttackTarget();
      this.unitAI.onEnd();
      scene.removeUnit(this.id);
    };
  }

  public setAiMovement(newAI: UnitAI) {
    this.unitAI.onEnd();
    this.unitAI = newAI;
    newAI.onStart();
  }

  public designateFollowTarget(scene, orbitTarget, returnTarget: Building) {
    this.target = orbitTarget;
    // If movement target is destroyed
    this.target.addDestructionCallback(() => {
      const goto = new GotoAI(this, returnTarget.body.position, () => {
        const orbit = new OrbitAI(this, returnTarget, this.body.position, 60, returnTarget.body.position);
        this.setAiMovement(orbit);
      });
      this.setAiMovement(goto);
    });

    const targetPosition = this.target.body.position;

    const goto = new GotoAI(this, targetPosition, () => {
      const orbit = new OrbitAI(this, orbitTarget, this.body.position, 60, this.target.body.position);
      this.setAiMovement(orbit);
    });
    this.setAiMovement(goto);
  }

  private removeAttackTarget() {
    this.attackTarget = null;
    clearInterval(this.attackTimer);
  }

  private designateAttackTarget(scene: ServerScene, target: Entity) {
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

  private searchForAttackTarget(scene: ServerScene) {
    let nextTarget: Entity = null;
    Object.keys(this.enemiesInLOS).forEach((enemyId) => {
      nextTarget = this.enemiesInLOS[enemyId];
    });
    if (nextTarget) this.designateAttackTarget(scene, nextTarget);
  }

  public isOrbiting(entity?: Entity): boolean {
    if (entity) {
      if (this.unitAI instanceof OrbitAI) {
        return (this.unitAI as OrbitAI).targetBuilding.id === entity.id;
      } else return false;
    } else {
      return this.unitAI instanceof OrbitAI;
    }
  }
  public isNotOrbiting(entity?: Entity): boolean {
    return !this.isOrbiting(entity);
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

  public sendServerDebugData() {}
} // end of Unit class

export default Unit;
