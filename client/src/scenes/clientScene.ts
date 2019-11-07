import Building from '../models/entities/building';
import Unit from '../models/entities/unit';
import GuiController, { getGuiController } from '../controllers/guiController';
import { getMinimapCamera, initMinimapCamera } from '../controllers/minimapController';
import { initDebugGui_sceneCommands } from '../utils/debugGui';
import { Events } from '../models/schemas/eventConstants';
import * as io from 'socket.io-client';
import Entity from '../models/entities/entity';

class ClientScene extends Phaser.Scene {
  private isConnected: boolean = false;
  private testBuilding: Building;

  public socket: SocketIOClient.Socket;
  public pingSocket: SocketIOClient.Socket;
  public pingStartTime;
  public pingInterval;

  public mainCamera: Phaser.Cameras.Scene2D.Camera;
  public minimapCamera: Phaser.Cameras.Scene2D.Camera;
  public guiController: GuiController;
  public howie: Phaser.Sound.BaseSound;
  public wilhelm: Phaser.Sound.BaseSound;
  public starfield: Phaser.GameObjects.TileSprite;
  public buildings: Phaser.GameObjects.Group;
  public units: Phaser.GameObjects.Group;
  public mouseOvers: Entity[] = [];
  public currentSelected: Entity[] = [];
  public mouseOversIndex: number = 0;
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
    // this.load.image('starfield', '../../assets/images/starfield2.png');
  }

  public create() {
    this.guiController = getGuiController();
    this.input.setTopOnly(false);
    initMinimapCamera(this);
    this.mainCamera = this.cameras.main;
    this.minimapCamera = getMinimapCamera();
    // this.starfield = this.add.tileSprite(500, 500, 1000, 1000, 'starfield');
    this.initKeyboardKeys();
    this.handleSockets();
    this.howie = this.sound.add('howie', { volume: 0.2 });
    this.wilhelm = this.sound.add('wilhelm', { volume: 0.2 });
    this.buildings = this.add.group([], {
      classType: Phaser.GameObjects.Sprite,
      name: 'buildings'
    });
    this.units = this.add.group([], {
      classType: Phaser.GameObjects.Sprite,
      name: 'units'
    });
    try {
      initDebugGui_sceneCommands(this);
    } catch (e) {
      console.log('Debug folder already exists');
    }

    // MAIN VARIABLE OBSERVER
    // this.registry.events.on('changedata', (parent, key, value) => {
    //   if (key === 'YOUR_VARIABLE') {
    // do something with your variable, as long as you already set it in the registry
    //   }
    // });

    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      if (deltaY > 0) {
        this.mainCamera.setZoom(this.mainCamera.zoom / 1.2);
        this.minimapCamera.setZoom(this.minimapCamera.zoom / 1.2);
      } else {
        this.mainCamera.setZoom(this.mainCamera.zoom * 1.2);
        this.minimapCamera.setZoom(this.minimapCamera.zoom * 1.2);
      }
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // prevent being able to click if over Minimap
      if (this.cameras.getCamerasBelowPointer(pointer).includes(this.minimapCamera) == false) {
        this.handleRightClick(pointer);
      }
    });
  }

  public update() {
    this.handleKeyboardKeys();
  }
  public handleRightClick(pointer: Phaser.Input.Pointer) {
    let worldX = pointer.worldX;
    let worldY = pointer.worldY;
    if (pointer.rightButtonDown()) {
      if (this.mouseOvers.length > 0) {
        console.log(`right mouse button clicked at ${worldX}, ${worldY}, targetId ${this.mouseOvers[0].id}`);
      }
      if (this.mouseOvers.length > 0 && this.currentSelected.length > 0) {
        this.socket.emit(Events.PLAYER_ISSUE_COMMAND, {
          x: worldX,
          y: worldY,
          selectedId: this.currentSelected[0].id,
          targetId: this.mouseOvers[0].id
        });
      }
    } else {
      const length = this.mouseOvers.length;
      const i = this.mouseOversIndex;
      if (length > 0) {
        //mouse is over objects
        if (this.currentSelected[0]) {
          let previouslySelected = this.currentSelected[0];
          previouslySelected.deselectedEvent();
        }
        this.currentSelected[0] = this.mouseOvers[i].selectedEvent();
        this.mouseOversIndex = i === length - 1 ? 0 : this.mouseOversIndex + 1;
      } else {
        this.socket.emit(Events.PLAYER_CONSTRUCT_BUILDING, { x: worldX, y: worldY });
      }
    }
  }
  public handleSockets() {
    this.pingSocket = io.connect('http://localhost:4000/ping-namespace');
    this.socket = io.connect('http://localhost:4000');

    this.socket.on(Events.CONNECTION, (player: string) => {
      this.guiController.showOverlayMessage(`Player: ${player} connected.`);
    });
    this.socket.on(Events.DISCONNECT, (player: string) => {
      this.guiController.showOverlayMessage(`Player: ${player} disconnected.`);
    });
    this.socket.on(Events.ERROR_STATUS, (errorMessage: string) => {
      this.guiController.showOverlayError(errorMessage);
    });
    this.socket.on(Events.GET_ALL_USER_NAMES, (userNames: string[]) => {
      console.log(userNames);
    });
    this.socket.on(Events.CHANGE_NAME_OK, (newName: string) => {
      this.data.set('userName', newName);
      this.guiController.showOverlayMessage(`Server allowed name change to: ${newName}`);
    });
    this.socket.on(Events.SERVER_STATUS_UPDATE, (position) => {
      // console.log(position);
      // this.updateSquarePosition(position);
    });
    this.socket.on(Events.NEW_UNIT_ADDED, (newUnit) => {
      console.log(newUnit);
      this.addNewUnitToScene(newUnit);
    });
    this.socket.on(Events.NEW_BUILDING_ADDED, (newBuilding) => {
      console.log(newBuilding);
      this.guiController.showOverlayMessage('New building added!');
      this.addNewBuildingToScene(newBuilding);
    });

    // this.socket.on(Events.PLAYER_ISSUE_COMMAND, (newEntity) => {
    //   console.log(newEntity);
    //   //this.addNewBuildingToScene(newEntity);
    // });

    this.pingSocket.on(Events.PONG_EVENT, () => {
      let latency = Date.now() - this.pingStartTime;
      this.guiController.showOverlayMessage(`latency: ${latency}ms`);
    });
  }

  public mouseOverEvent(objectMousedOver: Entity) {
    this.guiController.clearText();
    this.mouseOvers.push(objectMousedOver);
    this.mouseOversIndex = 0;
    // this.guiController.showMessage(`Selected: ${this.mouseOvers[0].id}`);
    this.mouseOvers.forEach((current) => {
      this.guiController.appendToTextArea(current.id);
    });
  }

  public mouseOffEvent(objectMousedOff: Entity) {
    this.guiController.clearText();
    const i = this.mouseOvers.indexOf(objectMousedOff);
    if (i > -1) {
      this.mouseOvers.splice(i, 1);
    }

    this.mouseOversIndex = 0;
    if (this.mouseOvers.length > 0) {
      this.mouseOvers.forEach((current) => {
        this.guiController.appendToTextArea(current.id);
      });
    }
    //this.debugText.setText(`Selected: ${this.mouseOvers.length}`);
  }

  public findBuildingById(id: string): Building {
    let buildingArray = this.buildings.getChildren();
    let foundBuilding = buildingArray.find((currentBuilding: Building) => {
      return currentBuilding.id === id;
    });
    if (!foundBuilding) throw new Error(`Building ${id} could not be found`);
    return foundBuilding as Building;
  }

  public findUnitById(id: string): Unit {
    let gameObject;
    //lookup id
    return gameObject;
  }

  public addNewBuildingToScene(options: { x: number; y: number; id: string; ownerId: string }) {
    const { x, y, id, ownerId } = options;
    const newBuilding = new Building(this, x, y, id, ownerId);
    console.log(this.buildings.getChildren());
    this.add.existing(newBuilding);
  }

  public addNewUnitToScene(options: { x: number; y: number; id: string; ownerId: string; targetId: string }) {
    const { x, y, id, ownerId, targetId } = options;
    const newUnit = new Unit(this, x, y, id, ownerId, this.findBuildingById(targetId));
    // this.add.existing(newUnit);
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

  public initKeyboardKeys() {
    this.keyW = this.input.keyboard.addKey('W');
    this.keyA = this.input.keyboard.addKey('A');
    this.keyS = this.input.keyboard.addKey('S');
    this.keyD = this.input.keyboard.addKey('D');
    this.keyESC = this.input.keyboard.addKey('ESC');
    this.keySHIFT = this.input.keyboard.addKey('SHIFT');
  }

  public handleKeyboardKeys() {
    let shiftDown = this.keySHIFT.isDown;
    let panFactor = shiftDown ? 50 : 20;
    if (this.keyW.isDown) {
      this.cameras.main.scrollY -= panFactor;
      this.minimapCamera.scrollY -= panFactor;
    }
    if (this.keyA.isDown) {
      this.cameras.main.scrollX -= panFactor;
      this.minimapCamera.scrollX -= panFactor;
    }
    if (this.keyS.isDown) {
      this.cameras.main.scrollY += panFactor;
      this.minimapCamera.scrollY += panFactor;
    }
    if (this.keyD.isDown) {
      this.cameras.main.scrollX += panFactor;
      this.minimapCamera.scrollX += panFactor;
    }
    if (this.keyESC.isDown) {
      this.currentSelected.forEach((current) => current.deselectedEvent());
      this.currentSelected = [];
    }
  }
}
export default ClientScene;
