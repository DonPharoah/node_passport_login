import { Building } from '../models/entities/building';
import { Unit } from '../models/entities/unit';
import { getMinimapCamera, initMinimapCamera } from '../controllers/minimapController';
import { initDebugGui_sceneCommands } from '../utils/debugGui';
import { Events } from '../models/schemas/eventConstants';
import { Utils } from '../utils/utils';
import * as io from 'socket.io-client';
import { Entity } from '../models/entities/entity';
import { Input } from 'phaser';

class ClientScene extends Phaser.Scene {
  private isConnected: boolean = false;
  private testBuilding: Building;

  public socket: SocketIOClient.Socket;
  public pingSocket: SocketIOClient.Socket;
  public pingStartTime;
  public pingInterval;

  public mainCamera: Phaser.Cameras.Scene2D.Camera;
  public minimapCamera: Phaser.Cameras.Scene2D.Camera;
  public viewportRect: Phaser.GameObjects.Rectangle;
  public gameBoundaryRect: Phaser.GameObjects.Rectangle;
  public howie: Phaser.Sound.BaseSound;
  public wilhelm: Phaser.Sound.BaseSound;
  public starfield: Phaser.GameObjects.TileSprite;
  public buildings: Phaser.GameObjects.Group;
  public units: Phaser.GameObjects.Group;
  public mouseOvers: Entity[] = [];
  public currentSelected: { entity: Entity; circle: Phaser.GameObjects.Image }[] = [];
  public mouseOversIndex: number = 0;
  public playerColor: string;
  public playersList: Players = {};
  public keyW: Phaser.Input.Keyboard.Key;
  public keyA: Phaser.Input.Keyboard.Key;
  public keyS: Phaser.Input.Keyboard.Key;
  public keyD: Phaser.Input.Keyboard.Key;
  public keyESC: Phaser.Input.Keyboard.Key;
  public keySHIFT: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'mainScene', visible: true, active: true });
  }

  public preload() {
    this.load.audio('howie', '../assets/sounds/howie-scream.mp3');
    this.load.audio('wilhelm', '../assets/sounds/wilhelm-scream.mp3');
    this.load.image('selectionCircle', '../../assets/images/SelectionCircle.png');
  }

  public create() {
    this.initGameVariables();
    this.initInputHandlers();
    this.setVariableObservers();
  }

  public update() {
    this.handleKeyboardKeys();
  }

  public setRegistryData() {
    this.registry.set('gameBoundary', {
      width: 4000,
      height: 4000
    });
  }

  public initGameVariables() {
    this.setRegistryData();
    this.initKeyboardKeys();
    const { width, height } = this.registry.get('gameBoundary');

    this.mainCamera = this.cameras.main;
    // this.mainCamera.setOrigin(0, 0);
    this.mainCamera.setBounds(0, 0, 4000, 4000);
    this.gameBoundaryRect = this.add.rectangle(2000, 2000, width, height).setStrokeStyle(4, 0xff0000);
    this.viewportRect = this.add
      .rectangle(
        this.mainCamera.displayHeight / 2,
        this.mainCamera.displayHeight / 2,
        this.mainCamera.displayWidth,
        this.mainCamera.displayHeight
      )
      .setStrokeStyle(10, 0x0033ff);
    this.minimapCamera = initMinimapCamera(this);
    // this.guiController = getGuiController();
    this.howie = this.sound.add('howie', { volume: 0 });
    this.wilhelm = this.sound.add('wilhelm', { volume: 0 });
    this.buildings = this.add.group([], {
      classType: Phaser.GameObjects.Sprite,
      name: 'buildings'
    });
    this.units = this.add.group([], {
      classType: Phaser.GameObjects.Sprite,
      name: 'units'
    });
    this.mainCamera.ignore(this.viewportRect);
    // this.minimapCamera.ignore(this.units);
    // this.starfield = this.add.tileSprite(500, 500, 1000, 1000, 'starfield');
  }

  public setVariableObservers() {
    // MAIN VARIABLE OBSERVER
    this.registry.events.on('changedata', (parent, key, value) => {
      if (key === 'YOUR_VARIABLE') {
        // do something with your variable, as long as you already set it in the registry
      }
    });
  }

  public initKeyboardKeys() {
    this.keyW = this.input.keyboard.addKey('W');
    this.keyA = this.input.keyboard.addKey('A');
    this.keyS = this.input.keyboard.addKey('S');
    this.keyD = this.input.keyboard.addKey('D');
    this.keyESC = this.input.keyboard.addKey('ESC');
    this.keySHIFT = this.input.keyboard.addKey('SHIFT');
  }

  public initInputHandlers() {
    this.input.setTopOnly(false);
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      let newZoom = deltaY > 0 ? this.mainCamera.zoom / 1.2 : this.mainCamera.zoom * 1.2;
      if (newZoom >= 0.3 && newZoom <= 1.45) {
        this.mainCamera.setZoom(newZoom);
        this.updateViewportRect();
        // this.updateViewportRectOnScroll();
      }
    });
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // prevent being able to click if over Minimap
      if (this.cameras.getCamerasBelowPointer(pointer).includes(this.minimapCamera) == false) {
        this.leftClickHandler(pointer);
        this.rightClickHandler(pointer);
      } else {
        this.minimapClickHandler(pointer);
      }
    });
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.cameras.getCamerasBelowPointer(pointer).includes(this.minimapCamera)) {
        this.minimapClickHandler(pointer);
      }
    });
  }

  public addSelectionCircle(position: { x; y }): Phaser.GameObjects.Image {
    const selectionCircle = this.add
      .image(position.x, position.y, 'selectionCircle')
      .setTint(0x0000ff, 0x0000ff, 0x0000ff, 0x0000ff)
      .setScale(0.5, 0.5)
      .setDepth(-1);
    this.tweens.add({
      targets: selectionCircle,
      angle: 360,
      duration: 3000,
      repeat: -1
    });
    return selectionCircle;
  }

  public leftClickHandler(pointer: Phaser.Input.Pointer) {
    if (pointer.primaryDown) {
      let worldX = pointer.worldX;
      let worldY = pointer.worldY;
      let uiScene = Utils.uiScene(this.game);

      const mouseOverSelected = this.currentSelected.filter((selected) =>
        this.mouseOvers.includes(selected.entity)
      );
      const isNoneSelected = mouseOverSelected.length === 0;

      if (this.mouseOvers.length > 0) {
        // Cursor over single entity

        if (this.currentSelected.length > 0) {
          // Currently selecting entity, so check if cursor is over selected
          this.mouseOversIndex = 0;

          if (this.keySHIFT.isDown) {
            if (isNoneSelected) {
              this.selectEntity(this.mouseOvers[this.mouseOversIndex]);
            } else {
              this.deselectEntity(
                this.currentSelected.find((selected) => selected.entity === mouseOverSelected[0].entity)
              );
            }
          } else {
            this.deselectAllEntities();
            this.selectEntity(this.mouseOvers[this.mouseOversIndex]);
          }

          // Currently selecting nothing, so select
        } else {
          if (isNoneSelected) this.selectEntity(this.mouseOvers[this.mouseOversIndex]);
        }
        // Cursor is over multiple entities, so deselect current entity
      } else {
        // Cursor is not over entity
        this.socket.emit(Events.PLAYER_CONSTRUCT_BUILDING, { x: worldX, y: worldY });
      }
    }
  }

  public rightClickHandler(pointer: Phaser.Input.Pointer) {
    if (pointer.rightButtonDown()) {
      let worldX = pointer.worldX;
      let worldY = pointer.worldY;
      if (this.mouseOvers.length > 0 && this.currentSelected.length > 0) {
        this.socket.emit(Events.PLAYER_ISSUE_COMMAND, {
          x: worldX,
          y: worldY,
          selectedId: this.currentSelected[0].entity.id,
          targetId: this.mouseOvers[0].id
        });
      }
    }
  }

  public minimapClickHandler(pointer: Phaser.Input.Pointer) {
    if (pointer.primaryDown) {
      // mainCamera's x and y coordinates are at top left, so must offset by half its size
      let x = this.minimapCamera.getWorldPoint(pointer.x, pointer.y).x;
      let y = this.minimapCamera.getWorldPoint(pointer.x, pointer.y).y;
      // this.mainCamera.setScroll(x, y);
      this.mainCamera.centerOn(x, y);
      this.updateViewportRect();
    }
  }

  public handleSockets() {
    let uiScene = Utils.uiScene(this.game);
    this.pingSocket = io.connect('http://localhost:4000/ping-namespace');
    this.socket = io.connect('http://localhost:4000');

    this.socket.on(Events.PLAYER_INIT, (playersList: Players) => {
      // code to run when server processes that the player has connected
      this.playersList = playersList;
      this.playerColor = playersList[this.socket.id].color;
    });
    this.socket.on(Events.CONNECTION, (player: Player) => {
      console.log('YOU CONNECTED');
      uiScene.showOverlayMessage(`Player: ${player} connected.`);
      this.playersList[player.id] = player;
    });
    this.socket.on(Events.PLAYER_DISCONNECTED, (player: Player) => {
      uiScene.showOverlayMessage(`Player: ${player.name} disconnected.`);
      delete this.playersList[player.id];
    });
    this.socket.on(
      Events.UPDATE_PLAYERS_LIST,
      (playersData: {
        newOwnerId: number;
        oldOwnerId: string;
        playersList: Players;
        joinOrLeave: number;
      }) => {
        console.log('running update_players_list');
        const { playersList } = playersData;
        this.playersList = playersList;
        this.updateEntityData(playersData);
      }
    );
    this.socket.on(Events.ERROR_STATUS, (errorMessage: string) => {
      uiScene.showOverlayError(errorMessage);
    });
    this.socket.on(Events.GET_ALL_USER_NAMES, (userNames: string[]) => {
      console.log(userNames);
    });
    this.socket.on(Events.CHANGE_NAME_OK, (newName: string) => {
      this.data.set('userName', newName);
      uiScene.showOverlayMessage(`Server allowed name change to: ${newName}`);
    });
    this.socket.on(Events.SERVER_STATUS_UPDATE, (unitPositions: { position: { x; y }; id: string }[]) => {
      unitPositions.forEach((current) => {
        const { position, id } = current;
        try {
          Utils.findUnitById(this, id).setPosition(position);
        } catch (e) {
          console.log(e);
        }
      });
    });
    this.socket.on(
      Events.NEW_UNIT_ADDED,
      (newUnit: { position: { x; y }; id: string; ownerId: string; targetId?: string }) => {
        console.log(newUnit);
        Utils.addNewUnitToScene(this, newUnit);
        this.howie.play();
      }
    );
    this.socket.on(
      Events.NEW_BUILDING_ADDED,
      (newBuilding: { position: { x; y }; id: string; ownerId: string; targetId?: string }) => {
        console.log(newBuilding);
        uiScene.showOverlayMessage('New building added!');
        Utils.addNewBuildingToScene(this, newBuilding, 'MINER');
      }
    );
    this.socket.on(Events.BUILDING_REMOVED, (removeBuildingId: string) => {
      Utils.removeBuildingFromScene(this, removeBuildingId);
      uiScene.showOverlayMessage('Building removed.');
    });
    this.socket.on(Events.UNIT_REMOVED, (removeUnitId: string) => {
      Utils.removeUnitFromScene(this, removeUnitId);
      this.wilhelm.play();
    });
    this.socket.on(
      Events.LOAD_ALL_BUILDINGS,
      (buildings: { position: { x; y }; id: string; ownerId: string }[]) => {
        buildings.forEach((building) => {
          Utils.addNewBuildingToScene(this, building, 'MINER');
        });
      }
    );
    this.socket.on(Events.LOAD_ALL_UNITS, (units: { position: { x; y }; id: string; ownerId: string }[]) => {
      units.forEach((unit) => {
        Utils.addNewUnitToScene(this, unit);
      });
    });
    // this.socket.on(Events.PLAYER_ISSUE_COMMAND, (newEntity) => {
    //   console.log(newEntity);
    //   //this.addNewBuildingToScene(newEntity);
    // });
    this.socket.on(Events.DEBUG_MESSAGE, (message) => {
      // uiScene.appendToTextArea(message);
    });
    this.pingSocket.on(Events.PONG_EVENT, () => {
      let latency = Date.now() - this.pingStartTime;
      uiScene.showOverlayMessage(`latency: ${latency}ms`);
    });
    this.socket.on(Events.UPDATE_ENTITY_HEALTH, (uuid, health, callerUuid) => {
      let damagerEntity: Entity;
      Utils.findEntityByIdAndRun(this, callerUuid, (entity) => {
        damagerEntity = entity;
      });
      Utils.findEntityByIdAndRun(this, uuid, (entity) => {
        // TODO: check that if when entity is destroyed, they aren't being selected. If so,
        // they will need to run the deselection event.
        entity.setHealth(health);
        this.drawLaser(damagerEntity.getPosition(), entity.getPosition());
      });
    });
  }

  public mouseOverEvent(objectMousedOver: Entity) {
    let uiScene = Utils.uiScene(this.game);
    uiScene.clearText();
    this.mouseOvers.push(objectMousedOver);
    // uiScene.showMessage(`Selected: ${this.mouseOvers[0].id}`);
    this.mouseOvers.forEach((current) => {
      //
    });
  }

  public mouseOffEvent(objectMousedOff: Entity) {
    let uiScene = Utils.uiScene(this.game);
    uiScene.clearText();
    const i = this.mouseOvers.indexOf(objectMousedOff);
    if (i > -1) {
      this.mouseOvers.splice(i, 1);
    }

    if (this.mouseOvers.length > 0) {
      this.mouseOvers.forEach((current) => {
        //
      });
    }
  }

  public buildingWasRemoved(building: Building) {
    let foundBuilding = this.findBuildingInCurrentSelected(building);
    if (foundBuilding) {
      this.deselectEntity(foundBuilding);
      Utils.uiScene(this.game).onSelectionAmountChanged(this.currentSelected);
    }
  }
  // public checkIfBuildingInCurrentSelected(building: Entity): boolean {
  //   return this.currentSelected.some((current) => current.entity === building);
  // }
  public findBuildingInCurrentSelected(
    building: Building
  ): { entity: Entity; circle: Phaser.GameObjects.Image } {
    let foundEntity = this.currentSelected.find((current) => current.entity === building);
    if (foundEntity) {
      return foundEntity;
    }
  }

  public updateEntityData(options) {
    const { newOwnerId, oldOwnerId, playersList, joinOrLeave } = options;
    if (joinOrLeave) {
      // NEW PLAYER JOINED
    } else {
      // PLAYER LEFT
      Utils.getBuildingsOfOwner(this, oldOwnerId, (buildings) => {
        buildings.map((ownerBuildings: Building) => {
          //ownerBuildings.color = color; // TODO Make method to change entity owner
          ownerBuildings.ownerId = newOwnerId;
          ownerBuildings.rectangle.setStrokeStyle(3, parseInt(playersList[newOwnerId].color, 16));
        });
      });
      // this.getUnitsOfOwner(oldOwnerId, (units) => {
      //   units.map((ownerUnits) => {
      //     // ownerUnits.color = color;
      //     ownerUnits.ownerId = newOwnerId;
      //   });
      // });
    }
  }

  public startPingServer() {
    this.pingInterval = setInterval(() => {
      this.pingStartTime = Date.now();
      this.pingSocket.emit(Events.PING_EVENT);
    }, 2000);
  }

  public stopPingServer() {
    clearInterval(this.pingInterval);
  }

  public drawLaser(positionStart: { x; y }, positionEnd: { x; y }) {
    const laserbeam: Phaser.GameObjects.Line = this.add.line();
    laserbeam
      .setOrigin(0, 0)
      .setTo(positionStart.x, positionStart.y, positionEnd.x, positionEnd.y)
      //.setTo(positionStart.x, positionStart.y, positionEnd.x, positionEnd.y)
      .setStrokeStyle(3, 0x00dd00, 1);

    this.tweens.add({
      targets: laserbeam,
      alpha: 0,
      duration: 1000,
      ease: 'Quart'
    });
  }

  public updateViewportRect() {
    this.sys.render(this.game.renderer);
    let worldView = this.mainCamera.worldView;
    this.viewportRect.setDisplaySize(this.mainCamera.displayWidth, this.mainCamera.displayHeight);
    this.viewportRect.setPosition(worldView.centerX, worldView.centerY); // working version
  }

  public handleKeyboardKeys() {
    let shiftDown = this.keySHIFT.isDown;
    let panFactor = shiftDown ? 50 : 20;
    if (this.keyW.isDown) {
      this.cameras.main.scrollY -= panFactor;
      this.updateViewportRect();
      // this.minimapCamera.scrollY -= panFactor;
    }
    if (this.keyA.isDown) {
      this.cameras.main.scrollX -= panFactor;
      this.updateViewportRect();
      // this.minimapCamera.scrollX -= panFactor;
    }
    if (this.keyS.isDown) {
      this.cameras.main.scrollY += panFactor;
      this.updateViewportRect();
      // this.minimapCamera.scrollY += panFactor;
    }
    if (this.keyD.isDown) {
      this.cameras.main.scrollX += panFactor;
      this.updateViewportRect();
      // this.minimapCamera.scrollX += panFactor;
    }
    if (this.keyESC.isDown) {
      this.deselectAllEntities();
    }
  }

  public selectEntity(selectedEntity: Entity) {
    const entity = selectedEntity;
    const circle = this.addSelectionCircle(entity.getPosition());
    this.currentSelected.push({ entity, circle });
  }

  public deselectAllEntities() {
    this.currentSelected.forEach((deselect) => this.deselectEntity(deselect));
    this.currentSelected = [];
    Utils.uiScene(this.game).onSelectionAmountChanged(this.currentSelected);
  }

  public deselectEntity(selectedEntity: { entity: Entity; circle: Phaser.GameObjects.Image }) {
    console.log('destroying selection circle...');
    selectedEntity.circle.destroy();
    this.currentSelected = this.currentSelected.filter(
      (deselect) => deselect.entity !== selectedEntity.entity
    );
  }
}
export let getClientSceneInstance;
export default ClientScene;
