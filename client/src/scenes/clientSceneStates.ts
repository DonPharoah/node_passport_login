import { Utils } from '../utils/utils';
import { Events } from '../models/schemas/eventConstants';
import ClientScene from './clientScene';
import { Entity } from '../models/entities/entity';
import { GameObjects, Physics } from 'phaser';
import { Building } from '../models/entities/building';
import buildingPresets from '../models/schemas/buildings/buildingPresets';
import { BuildingFactory } from '../models/entities/factories/buildingFactory';

export abstract class ClientSceneMode {
  abstract scene: ClientScene;
  // State Singletons
  public static DEFAULT_MODE: DefaultClientSceneMode;
  public static BUILDING_PLACEMENT_MODE: BuildingPlacementClientSceneMode;

  static initClientSceneStates(scene: ClientScene) {
    ClientSceneMode.DEFAULT_MODE = new DefaultClientSceneMode(scene);
    ClientSceneMode.BUILDING_PLACEMENT_MODE = new BuildingPlacementClientSceneMode(scene);
  }

  onEnterState() {}
  onExitState() {}
  leftClickHandler(pointer: Phaser.Input.Pointer) {}
  rightClickHandler(pointer: Phaser.Input.Pointer) {}
  onCursorMove(pointer: Phaser.Input.Pointer) {}
}

// DEFAULT STATE
export class DefaultClientSceneMode implements ClientSceneMode {
  scene: ClientScene;
  key1;
  key2;
  constructor(scene: ClientScene) {
    this.scene = scene;
  }

  onEnterState() {
    this.key1 = this.scene.input.keyboard.addKey('ONE');
    this.key2 = this.scene.input.keyboard.addKey('TWO');

    this.key1.on('down', () => {
      ClientSceneMode.BUILDING_PLACEMENT_MODE.currentPlacedBuildingType = 'MINER';
      this.scene.setClientSceneState(ClientSceneMode.BUILDING_PLACEMENT_MODE);
    });
    this.key2.on('down', () => {
      ClientSceneMode.BUILDING_PLACEMENT_MODE.currentPlacedBuildingType = 'BARRACKS';
      this.scene.setClientSceneState(ClientSceneMode.BUILDING_PLACEMENT_MODE);
    });
  }

  onExitState() {
    this.scene.input.keyboard.removeKey('ONE');
    this.scene.input.keyboard.removeKey('TWO');
    this.scene.deselectAllEntities();
  }

  leftClickHandler(pointer: Phaser.Input.Pointer) {
    if (pointer.primaryDown) {
      let worldX = pointer.worldX;
      let worldY = pointer.worldY;
      //let uiScene = Utils.uiScene(this.game);

      const mouseOverSelected = this.scene.currentSelected.filter((selected) =>
        this.scene.mouseOvers.includes(selected.entity)
      );
      const isNoneSelected = mouseOverSelected.length === 0;

      if (this.scene.mouseOvers.length > 0) {
        // Cursor over single entity

        if (this.scene.currentSelected.length > 0) {
          // Currently selecting entity, so check if cursor is over selected
          this.scene.mouseOversIndex = 0;

          if (this.scene.keySHIFT.isDown) {
            if (isNoneSelected) {
              this.scene.selectEntity(this.scene.mouseOvers[0]);
            } else {
              this.scene.deselectEntity(
                this.scene.currentSelected.find((selected) => selected.entity === mouseOverSelected[0].entity)
              );
            }
          } else {
            this.scene.deselectAllEntities();
            this.scene.selectEntity(this.scene.mouseOvers[0]);
          }

          // Currently selecting nothing, so select
        } else {
          if (isNoneSelected) this.scene.selectEntity(this.scene.mouseOvers[0]);
        }
        // Cursor is over multiple entities, so deselect current entity
      } else {
        // Cursor is not over entity
      }
    }
  }

  rightClickHandler(pointer: Phaser.Input.Pointer) {
    if (pointer.rightButtonDown()) {
      let worldX = pointer.worldX;
      let worldY = pointer.worldY;
      const selectedIds: string[] = this.scene.currentSelected.map((element) => element.entity.id);
      if (this.scene.mouseOvers.length > 0 && this.scene.currentSelected.length > 0) {
        this.scene.sendPlayerCommandEvent(worldX, worldY, selectedIds);
      }
    }
  }
  onCursorMove(pointer: Phaser.Input.Pointer) {}
}

// BUILDING PLACEMENT STATE
export class BuildingPlacementClientSceneMode implements ClientSceneMode {
  scene: ClientScene;
  currentPlacedBuildingType: BuildingPresetConstants = 'MINER';
  ghostBuilding: Phaser.GameObjects.Rectangle;
  placementRestrictionCircle: Phaser.GameObjects.Shape;
  //cursorPosition: { x; y } = { x: 0, y: 0 };
  key1;
  key2;

  canBePlaced: boolean = true;

  constructor(scene: ClientScene, defaultBuildingType?: BuildingPresetConstants) {
    this.scene = scene;
    if (defaultBuildingType) this.currentPlacedBuildingType = defaultBuildingType;
  }

  onEnterState() {
    this.setPlacementBuildingType(this.currentPlacedBuildingType);

    this.key1 = this.scene.input.keyboard.addKey('ONE');
    this.key2 = this.scene.input.keyboard.addKey('TWO');

    this.key1.on('down', () => this.setPlacementBuildingType('MINER'));
    this.key2.on('down', () => this.setPlacementBuildingType('BARRACKS'));

    this.placementRestrictionCircle = this.scene
      .getPlacementRestrictionCircle(
        this.ghostBuilding.x,
        this.ghostBuilding.y,
        this.currentPlacedBuildingType
      )
      .setFillStyle(0xffffff, 0.05);

    const body = new Phaser.Physics.Arcade.Body(this.scene.physics.world, this.placementRestrictionCircle);
    body.setCircle(this.scene.BUILDING_PLACEMENT_RADIUS);
    this.placementRestrictionCircle.body = body;
    this.scene.physics.add.existing(this.placementRestrictionCircle);

    const collider: Physics.Arcade.Collider = this.scene.physics.add.overlap(
      this.placementRestrictionCircle,
      this.scene.buildingPhysicsGroup,
      () => {
        this.canBePlaced = false;
        this.checkPlacementRestrictions();
      }
    );

    // WHY THE FUCK DOESN"T THIS WORK THE FIRST TIME
  }
  onExitState() {
    if (this.ghostBuilding) this.ghostBuilding.destroy();
    if (this.placementRestrictionCircle) this.placementRestrictionCircle.destroy();
    this.scene.input.keyboard.removeKey('ONE');
    this.scene.input.keyboard.removeKey('TWO');
  }

  private setPlacementBuildingType(newPlacementBuildingType: BuildingPresetConstants) {
    if (this.ghostBuilding) this.ghostBuilding.destroy();
    //if (this.placementRestrictionCircle) this.placementRestrictionCircle.destroy();
    this.currentPlacedBuildingType = newPlacementBuildingType;

    this.ghostBuilding = Building.createBuildingShape(
      buildingPresets[newPlacementBuildingType],
      this.scene,
      this.scene.input.activePointer.position.x,
      this.scene.input.activePointer.position.y
    );
    this.ghostBuilding.setAlpha(0.25);
  }

  private checkPlacementRestrictions() {
    // First call of overlap doesn't work, the building hitboxes seem to be offset.
    // this.canBePlaced = !this.scene.physics.world.overlap(
    //   this.placementRestrictionCircle,
    //   this.scene.buildingPhysicsGroup
    // );

    if (this.canBePlaced) this.placementRestrictionCircle.setFillStyle(0xffffff, 0.05);
    else this.placementRestrictionCircle.setFillStyle(0xff0000, 0.1);
  }

  leftClickHandler(pointer: Phaser.Input.Pointer) {
    if (pointer.primaryDown) {
      let worldX = pointer.worldX;
      let worldY = pointer.worldY;
      //let uiScene = Utils.uiScene(this.game);

      if (this.canBePlaced)
        this.scene.sendConstructBuildingEvent(worldX, worldY, this.currentPlacedBuildingType);
    }
  }

  rightClickHandler(pointer: Phaser.Input.Pointer) {}
  onCursorMove(pointer: Phaser.Input.Pointer) {
    this.ghostBuilding.setPosition(pointer.position.x, pointer.position.y);
    this.placementRestrictionCircle.setPosition(pointer.position.x, pointer.position.y);
    this.canBePlaced = !this.scene.physics.world.overlap(
      this.placementRestrictionCircle,
      this.scene.buildingPhysicsGroup
    );
    this.checkPlacementRestrictions();
  }
}
