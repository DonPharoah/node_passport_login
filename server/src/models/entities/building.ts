// import MainScene from '../scenes/serverScene';
import { Engine, World, Bodies, Body, Vector } from 'matter-js';
import { getSeed } from '../../utils/seed';
import Entity from './entity';
import { Bounds, Composite, Events as MatterEvents } from 'matter-js';
import Unit from './unit';
import ServerScene from '../../scenes/serverScene';
import buildingPresets from '../schemas/buildings/buildingPresets';
import { OrbitAI } from '../schemas/unitMovements';
import DebugOverlay from '../../utils/debugOverlay';
// import { BuildingDefaults } from '../schemas/buildings/buildingDefaults';
// export declare type BuildingPresetConstants = 'HOME_BASE' | 'BARRACKS' | 'MINER' | 'REPAIR_DRONE_FACTORY';
export type BuildingPresetConstants = typeof Building.PresetConstants;

class Building extends Entity {
  public static readonly PresetConstants: 'HOME_BASE' | 'BARRACKS' | 'MINER' | 'REPAIR_DRONE_FACTORY';
  public readonly body: Body;
  public readonly range: Body;
  public preset: BuildingDefaults;
  private orbiters: OrbitAI[] = [];

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

  public onUnitEnteredOrbit(enteringOrbit: OrbitAI) {
    this.orbiters.push(enteringOrbit);
    this.setOrbiterPattern();
    //
  }
  public onUnitLeftOrbit(leavingOrbit: OrbitAI) {
    this.orbiters = this.orbiters.filter((orbiter) => orbiter.owner.id !== leavingOrbit.owner.id);

    this.setOrbiterPattern();
    //
  }
  private setOrbiterPattern() {
    for (let i = 0; i < this.orbiters.length; i++) {
      const separationAngle = (2 * Math.PI) / this.orbiters.length;
      this.orbiters[i].setAngle(i * separationAngle);
    }
    this.sendServerDebugData();
  }

  public sendServerDebugData() {
    /*let i = 0;
    DebugOverlay.setEntityTooltip(this, this.orbiters, (orbiter: OrbitAI) => {
      i++;
      return '' + i;
    });*/
    DebugOverlay.setEntityTooltip(this, `beta orbiters: ${this.orbiters.length}`);
  }
}
export default Building;
