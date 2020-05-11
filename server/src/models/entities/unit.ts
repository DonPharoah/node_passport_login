import Building from './building';
import { Engine, World, Bodies, Body, Vector } from 'matter-js';
import { getSeed } from '../../utils/seed';
import Entity from './entity';
import ServerScene from '../../scenes/serverScene';
import { UnitAI, OrbitAI, GotoAI, IdleAI } from '../schemas/unitMovements';
import { EntitySchema } from '../schemas/entitySchema';

class Unit extends Entity {
  public readonly body: Body;
  public readonly range: Body;
  private target: Building;
  private unitAI: UnitAI = new IdleAI();
  private friendsInLOS = {};
  private enemiesInLOS = {};
  private targetedEntity: Entity;
  private actionTimer;

  private isAttacking: boolean = false;

  public preset: EntitySchema = { maxHealth: 100 }; //TODO UNIT SCHEMAS

  constructor(scene: ServerScene, position: Vector, radius, target: Building, returnTarget?: Building) {
    super();
    Entity.scene = scene;
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
      if (collidedObject.ownerEntity.ownerId === this.ownerId) this.onFriendEnteringRange(collidingEntity);
      else this.onEnemyEnteringRange(collidingEntity);
    };
    // @ts-ignore
    this.body.onCollisionEnd = (collidedObject) => {
      // Called when line of sight ends, due to either target leaving range or being destroyed
      const targetEntity = collidedObject.ownerEntity as Entity;

      if (collidedObject.ownerEntity.ownerId !== this.ownerId) {
        delete this.enemiesInLOS[targetEntity.id];
      } else {
        delete this.friendsInLOS[targetEntity.id];
      }

      if (targetEntity === this.targetedEntity) {
        // Remove attack observer and stop timer
        this.removeActionTarget();
        this.assessEntitiesInRange();
      }
    };
    this.designateFollowTarget(scene, target, returnTarget);

    this.id = seed.generate();

    this.onDestroyedEvent = () => {
      // @ts-ignore
      this.body.onCollisionEnd = (collidedObject) => {};
      this.removeActionTarget();
      this.unitAI.onEnd();
      scene.removeUnit(this.id);
    };
  }

  public setAiMovement(newAI: UnitAI) {
    this.unitAI.onEnd();
    this.unitAI = newAI;
    newAI.onStart();
  }

  private onEnemyEnteringRange(newEnemyInRange: Entity) {
    this.enemiesInLOS[newEnemyInRange.id] = newEnemyInRange;
    if (!this.targetedEntity) this.assessEntitiesInRange();
  }

  private onFriendEnteringRange(newFriendInRange: Entity) {
    this.friendsInLOS[newFriendInRange.id] = newFriendInRange;

    if (!this.targetedEntity) this.assessEntitiesInRange();
  }

  // CAN POSSIBLY MAKE WAY FOR MORE COMPLEX AI
  private assessEntitiesInRange() {
    let keys = Object.keys(this.enemiesInLOS);
    if (keys.length > 0) {
      this.designateAttackTarget(Entity.scene, this.enemiesInLOS[keys[0]] as Entity);
      return;
    }
    keys = Object.keys(this.friendsInLOS);
    //console.log('FRIENDS ' + keys.length);
    /*if (keys.length > 0) {
      const damagedEntityFriends: any[] = Object.values(this.friendsInLOS).filter((friendInLOS: Entity) => {
        friendInLOS.currentHealth < friendInLOS.preset.maxHealth;
      });
      if (damagedEntityFriends.length > 0) {
        this.designateRepairTarget(Entity.scene, damagedEntityFriends[keys[0]]);
      }
      return;
    }*/
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

  private removeActionTarget() {
    this.targetedEntity = null;
    clearInterval(this.actionTimer);
  }

  private designateAttackTarget(scene: ServerScene, target: Entity) {
    this.targetedEntity = target;
    clearInterval(this.actionTimer);
    this.actionTimer = setInterval(() => {
      //console.log(targetBuilding.id);
      this.targetedEntity.takeDamage(50);
      scene.updateEntityHealth(this.targetedEntity, this);
    }, 1000);
    this.targetedEntity.addDestructionCallback(() => {
      clearInterval(this.actionTimer);
    });
  }

  private designateRepairTarget(scene: ServerScene, target: Entity) {
    this.targetedEntity = target;
    clearInterval(this.actionTimer);
    this.actionTimer = setInterval(() => {
      if (this.targetedEntity.currentHealth < this.targetedEntity.preset.maxHealth) {
        this.targetedEntity.repairDamage(5);
        scene.updateEntityHealth(this.targetedEntity, this);
      } else {
        clearInterval(this.actionTimer);
        const damagedFriendlyEntities = Object.values(this.friendsInLOS).filter(
          (friendlyEntity: Entity) => friendlyEntity.currentHealth < friendlyEntity.preset.maxHealth
        );
        if (damagedFriendlyEntities.length > 0) {
          this.designateRepairTarget(scene, damagedFriendlyEntities[0] as Entity);
        }
      }
    }, 1000);
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
    this.removeActionTarget();
  }

  public sendServerDebugData() {}
} // end of Unit class

export default Unit;
