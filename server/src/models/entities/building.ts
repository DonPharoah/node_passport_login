// import MainScene from '../scenes/serverScene';
import { Engine, World, Bodies, Body, Vector } from 'matter-js';
import { getSeed } from '../../utils/seed';
import Entity from './entity';
import { Bounds, Composite, Events as MatterEvents } from 'matter-js';
import Unit from './unit';
import ServerScene from '../../scenes/serverScene';
import buildingPresets from '../schemas/buildings/buildingPresets';
// import { BuildingDefaults } from '../schemas/buildings/buildingDefaults';
// export declare type BuildingPresetConstants = 'HOME_BASE' | 'BARRACKS' | 'MINER' | 'REPAIR_DRONE_FACTORY';
export type BuildingPresetConstants = typeof Building.PresetConstants;

class Building extends Entity {
  public static readonly PresetConstants: 'HOME_BASE' | 'BARRACKS' | 'MINER' | 'REPAIR_DRONE_FACTORY';
  public readonly body: Body;
  public readonly range: Body;
  public preset: BuildingDefaults;

  constructor(
    scene: ServerScene,
    presetType: BuildingPresetConstants,
    position: Vector,
    radius: number,
    ownerId: string
  ) {
    super();
    const { x, y } = position;
    const seed = getSeed();
    this.id = seed.generate();

    this.hydratePresetData(presetType);
    this.currentHealth = this.preset.maxHealth;

    this.body = Bodies.circle(x, y, radius, { isStatic: true, isSensor: false });
    //this.range = Bodies.circle(x, y, radius, { isStatic: true, isSensor: false });
    // @ts-ignore
    this.body.ownerEntity = this;
    // @ts-ignore
    this.body.onCollision = (collidedObject) => {
      //console.log(`COLLISION: UNIT ${this.ownerId} AND BUILDING ${collidedObject.ownerEntity.ownerId}`);
    };
    // @ts-ignore
    this.body.onCollisionEnd = (collidedObject) => {};

    this.onDestroyedEvent = () => {
      scene.removeBuilding(this.id);
    };
  }

  public onDestroyedEvent;
  public isDamagable(): boolean {
    return true;
  }

  public hydratePresetData(presetType: BuildingPresetConstants) {
    this.preset = { ...buildingPresets[presetType] };
  }

  public issueCommand(
    scene: ServerScene,
    commandingBuilding: Building,
    buildingTargeted: Entity,
    position: { x; y }
  ) {
    this.preset.rightClickCommand(scene, commandingBuilding, buildingTargeted, position);
  }

  public setOwner(nweOwnerId: string) {
    this.ownerId = nweOwnerId;
  }
}
export default Building;
