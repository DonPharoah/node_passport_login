import Building from '../entities/building';
import Unit from '../entities/unit';
import { initDebugGui_sceneCommands } from '../utils/debugGui';
import { Events } from '../interfaces/eventConstants';
import * as io from 'socket.io-client';
import { GameObjects } from 'phaser';

class ClientScene extends Phaser.Scene {
  private isConnected: boolean = false;
  private testBuilding: Building;
  public titleText: Phaser.GameObjects.Text;
  public debugText: Phaser.GameObjects.Text;
  public errorText: Phaser.GameObjects.Text;
  public userNameText: Phaser.GameObjects.Text;

  public socket: SocketIOClient.Socket;
  public pingSocket: SocketIOClient.Socket;
  public pingStartTime;
  public pingInterval;

  public minimapCamera: Phaser.Cameras.Scene2D.Camera;
  public howie: Phaser.Sound.BaseSound;
  public wilhelm: Phaser.Sound.BaseSound;
  public buildings: Phaser.GameObjects.Group;
  public units: Phaser.GameObjects.Group;
  public mouseOvers: Selectable[] = [];
  public currentSelected: Selectable[] = [];
  public mouseOversIndex: number = 0;
  public keyW: Phaser.Input.Keyboard.Key;
  public keyA: Phaser.Input.Keyboard.Key;
  public keyS: Phaser.Input.Keyboard.Key;
  public keyD: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'mainScene', visible: true, active: true });
  }

  public preload() {
    this.load.audio('howie', '../assets/sounds/howie-scream.mp3');
    this.load.audio('wilhelm', '../assets/sounds/wilhelm-scream.mp3');
  }

  public create() {
    this.input.setTopOnly(false);
    this.initCameras();
    this.initWASD();
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
    this.registry.set('userName', 'Default User Name');
    this.titleText = this.add.text(20, 20, 'In Debug Scene', { fontSize: '20px' });
    this.debugText = this.add.text(20, 50, 'Testing', { fontSize: '20px' });
    this.userNameText = this.add.text(20, 80, `Player name: ${this.data.get('userName')}`, {
      fontSize: '20px'
    });
    this.errorText = this.add.text(20, 140, '', { fontSize: '20px', color: 'red' });

    try {
      initDebugGui_sceneCommands(this);
    } catch (e) {
      console.log('Debug folder already exists');
    }

    // MAIN VARIABLE OBSERVER
    this.registry.events.on('changedata', (parent, key, value) => {
      if (key === 'userName') {
        this.userNameText.setText(`Player name: ${value}`);
      }
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      let worldX = pointer.worldX;
      let worldY = pointer.worldY;
      if (pointer.rightButtonDown()) {
        console.log(`right mouse button clicked at ${worldX}, ${worldY}`);
        if (this.mouseOvers.length > 0 && this.currentSelected.length > 0) {
          this.socket.emit(Events.PLAYER_ISSUE_COMMAND, {
            x: worldX,
            y: worldY,
            target: this.currentSelected[0]
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
          this.showMessage('Nothing');
        }
      }
    });
  }

  public update() {
    this.handleWASD();
  }

  public handleSockets() {
    this.pingSocket = io.connect('http://localhost:4000/ping-namespace');
    this.socket = io.connect('http://localhost:4000');

    this.socket.on(Events.CONNECTION, (player: string) => {
      this.showMessage(`Player: ${player} connected.`);
    });
    this.socket.on(Events.DISCONNECT, (player: string) => {
      this.showMessage(`Player: ${player} disconnected.`);
    });
    this.socket.on(Events.ERROR_STATUS, (errorMessage: string) => {
      this.showError(errorMessage);
    });
    this.socket.on(Events.GET_ALL_USER_NAMES, (userNames: string[]) => {
      console.log(userNames);
    });
    this.socket.on(Events.CHANGE_NAME_OK, (newName: string) => {
      this.data.set('userName', newName);
      this.showMessage(`Server allowed name change to: ${newName}`);
    });
    this.socket.on(Events.SERVER_STATUS_UPDATE, (position) => {
      // console.log(position);
      // this.updateSquarePosition(position);
    });
    this.socket.on(Events.NEW_UNIT_ADDED, (newEntity) => {
      console.log(newEntity);
      this.addNewUnitToScene(newEntity);
    });
    this.socket.on(Events.NEW_BUILDING_ADDED, (newEntity) => {
      console.log(newEntity);
      this.addNewBuildingToScene(newEntity);
    });

    this.socket.on(Events.PLAYER_ISSUE_COMMAND, (newEntity) => {
      console.log(newEntity);
      this.addNewBuildingToScene(newEntity);
    });

    this.pingSocket.on(Events.PONG_EVENT, () => {
      let latency = Date.now() - this.pingStartTime;
      this.showMessage(`latency: ${latency}ms`);
    });
  }

  public mouseOverEvent(objectMousedOver: Selectable) {
    this.mouseOvers.push(objectMousedOver);
    this.mouseOversIndex = 0;
    //this.debugText.setText(`Selected: ${this.mouseOvers.length}`);
  }

  public mouseOffEvent(objectMousedOff: Selectable) {
    const i = this.mouseOvers.indexOf(objectMousedOff);
    if (i > -1) {
      this.mouseOvers.splice(i, 1);
    }

    this.mouseOversIndex = 0;
    //this.debugText.setText(`Selected: ${this.mouseOvers.length}`);
  }

  public findBuildingById(id: string): Building {
    let buildingArray = this.buildings.getChildren() as Building[];
    let foundBuilding = buildingArray.find((currentBuilding) => {
      return currentBuilding.id === id;
    });
    if (!foundBuilding) throw new Error('Building could not be found');
    return foundBuilding;
  }

  public findUnitById(id: string): Unit {
    let gameObject;
    //lookup id
    return gameObject;
  }

  public showMessage(message = 'Default text') {
    console.log(message);
    this.tweens.killTweensOf(this.debugText);
    this.debugText.setText(message);
    this.debugText.alpha = 1;
    this.tweens.add({
      targets: this.debugText,
      alpha: 0,
      duration: 5000,
      ease: 'Quad'
    });
  }

  public showError(error = '') {
    console.log(error);
    this.tweens.killTweensOf(this.errorText);
    this.errorText.setText(error);
    this.errorText.alpha = 1;
    this.tweens.add({
      targets: this.errorText,
      alpha: 0,
      duration: 5000,
      ease: 'Quad'
    });
  }

  public addNewBuildingToScene(options: { x: number; y: number; id: string; ownerId: string }) {
    const { x, y, id, ownerId } = options;
    const newBuilding = new Building(this, x, y, id, ownerId);
    console.log(this.buildings.getChildren());
    try {
      console.log(this.findBuildingById(id));
    } catch (e) {
      console.log(e);
    }

    // this.add.existing(newBuilding);
  }

  public addNewUnitToScene(options: { x: number; y: number; id: string; ownerId: string; target: Building }) {
    const { x, y, id, ownerId, target } = options;
    const newUnit = new Unit(this, x, y, target, ownerId, id);
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

  public initCameras() {
    this.cameras.main.setLerp(0.5, 0.5);
    this.minimapCamera = this.cameras.add(
      (this.game.config.width as number) - 200,
      (this.game.config.height as number) - 200,
      200,
      200,
      false,
      'mainScene'
    );
    this.minimapCamera
      .setScene(this)
      .setZoom(0.1)
      .centerToSize()
      .setBackgroundColor('#222222');
    this.minimapCamera.scrollX = 700;
    this.minimapCamera.scrollY = 700;
  }

  public initWASD() {
    this.keyW = this.input.keyboard.addKey('W');
    this.keyA = this.input.keyboard.addKey('A');
    this.keyS = this.input.keyboard.addKey('S');
    this.keyD = this.input.keyboard.addKey('D');
  }

  public handleWASD() {
    if (this.keyW.isDown) {
      this.cameras.main.scrollY -= 20;
      this.minimapCamera.scrollY -= 20;
    }
    if (this.keyA.isDown) {
      this.cameras.main.scrollX -= 20;
      this.minimapCamera.scrollX -= 20;
    }
    if (this.keyS.isDown) {
      this.cameras.main.scrollY += 20;
      this.minimapCamera.scrollY += 20;
    }
    if (this.keyD.isDown) {
      this.cameras.main.scrollX += 20;
      this.minimapCamera.scrollX += 20;
    }
  }
}
export default ClientScene;
