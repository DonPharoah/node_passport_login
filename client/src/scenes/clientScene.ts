import Building from '../entities/building';
import Unit from '../entities/unit';
import { initDebugGui_sceneCommands } from '../utils/debugGui';
import { Events } from '../interfaces/eventConstants';
import * as io from 'socket.io-client';

class ClientScene extends Phaser.Scene {
  private box: Phaser.GameObjects.Rectangle;
  private ground: Phaser.GameObjects.Rectangle;
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
  public howie: Phaser.Sound.BaseSound;
  public wilhelm: Phaser.Sound.BaseSound;
  public buildings: Phaser.GameObjects.Group;

  public mouseOvers: Selectable[] = [];
  public currentSelected: Selectable[] = [];
  public mouseOversIndex: number = 0;

  constructor() {
    super({ key: 'mainScene' });
  }
  public preload() {
    this.load.audio('howie', '../assets/sounds/howie-scream.mp3');
    this.load.audio('wilhelm', '../assets/sounds/wilhelm-scream.mp3');
  }
  public create() {
    this.input.setTopOnly(false);
    this.pingSocket = io.connect('http://localhost:4000/ping-namespace');
    this.socket = io.connect('http://localhost:4000');
    this.howie = this.sound.add('howie', { volume: 0.3 });
    this.wilhelm = this.sound.add('wilhelm', { volume: 0.3 });
    this.box = this.add.rectangle(400, 200, 80, 80, 0xffffff);
    this.ground = this.add.rectangle(400, 500, 500, 30, 0xffffff);
    // this.physics.add.existing(this.square);
    this.buildings = this.add.group([], {
      name: 'buildings',
      key: 'building'
    });
    this.data.set('userName', 'Default User Name');
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
      this.addNewEntityToScene(newEntity);
    });

    this.pingSocket.on(Events.PONG_EVENT, () => {
      let latency = Date.now() - this.pingStartTime;
      this.showMessage(`latency: ${latency}ms`);
    });

    this.events.on(
      'changedata-userName',
      (parent, value) => {
        this.userNameText.setText(`Player name: ${value}`);
        // this.socket.emit('changeName', value);
      },
      this
    );
    this.input.on('pointerdown', (pointer) => {
      let { x, y } = pointer;
      const length = this.mouseOvers.length;
      const i = this.mouseOversIndex;
      if (length > 0) {
        //mouse is over objects
        let previouslySelected = this.currentSelected[0];
        this.currentSelected[0] = this.mouseOvers[i].selectedEvent();
        previouslySelected.deselectedEvent();
        this.mouseOversIndex = i === length - 1 ? 0 : this.mouseOversIndex + 1;
      } else {
        this.socket.emit(Events.PLAYER_CONSTRUCT_BUILDING, { x: x, y: y });
        this.debugText.setText('Nothing');
      }
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

  public update() {
    const cursorKeys = this.input.keyboard.createCursorKeys();
  }
  showMessage(message = 'Default text') {
    console.log(message);
    this.debugText.setText(message);
    this.debugText.alpha = 1;
    this.tweens.killTweensOf(this.debugText);
    this.tweens.add({
      targets: this.debugText,
      alpha: 0,
      duration: 5000,
      ease: 'Quad'
    });
  }
  showError(error = '') {
    console.log(error);
    this.errorText.setText(error);
    this.errorText.alpha = 1;
    this.tweens.killTweensOf(this.errorText);
    this.tweens.add({
      targets: this.errorText,
      alpha: 0,
      duration: 5000,
      ease: 'Quad'
    });
  }
  addNewEntityToScene(options: { x: number; y: number; id: string; ownerId: string }) {
    //this.add.circle(options.x, options.y, 30, 0xffffff);
    const { x, y, id, ownerId } = options;
    // uncomment
    const newBuilding = new Building(this, x, y, id, ownerId);
    this.add.existing(newBuilding);
  }
  updateSquarePosition(position) {
    const { x, y } = position;
    this.box.x = x;
    this.box.y = y;
  }
  startPingServer() {
    this.pingInterval = setInterval(() => {
      this.pingStartTime = Date.now();
      this.pingSocket.emit(Events.PING_EVENT);
    }, 2000);
  }
  stopPingServer() {
    clearInterval(this.pingInterval);
  }
}
export default ClientScene;
