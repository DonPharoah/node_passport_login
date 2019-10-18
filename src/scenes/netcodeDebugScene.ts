import debugGui from '../utils/debugGui';
import * as io from 'socket.io-client';

class NetcodeDebugScene extends Phaser.Scene {
  public titleText: Phaser.GameObjects.Text;
  public debugText: Phaser.GameObjects.Text;
  public errorText: Phaser.GameObjects.Text;
  public userNameText: Phaser.GameObjects.Text;
  private debugGuiFolder;
  public socket: SocketIOClient.Socket;
  private debugGuiOptions = function(context: NetcodeDebugScene) {
    this.genericInput = 'defaultText';
    this.sendMessageEvent = () => context.showMessage(this.genericInput);
    this.sendTestErrorEvent = () => context.showError(this.genericInput);
    this.requestChangeUserName = () => context.socket.emit('changeName', this.genericInput);
    this.setUserName = () => context.data.set('userName', this.genericInput);
    this.getAllUsers = () => context.socket.emit('getAllUserNames');
  };
  private optionsInstance;

  constructor() {
    super({ key: 'debugScene', active: false });
  }

  create() {
    this.data.set('userName', 'Default User Name');
    this.socket = io('http://localhost:3000/debug-namespace');
    this.titleText = this.add.text(20, 20, 'In Debug Scene', { fontSize: '20px' });
    this.debugText = this.add.text(20, 50, 'Testing', { fontSize: '20px' });
    this.userNameText = this.add.text(20, 80, 'Default User Name', { fontSize: '20px' });
    this.errorText = this.add.text(20, 140, '', { fontSize: '20px', color: 'red' });
    try {
      this.optionsInstance = new this.debugGuiOptions(this);
      this.debugGuiFolder = debugGui.addFolder('Debug Gui');
      this.debugGuiFolder.add(this.optionsInstance, 'genericInput');
      this.debugGuiFolder.add(this.optionsInstance, 'sendMessageEvent');
      this.debugGuiFolder.add(this.optionsInstance, 'sendTestErrorEvent');
      this.debugGuiFolder.add(this.optionsInstance, 'setUserName');
      this.debugGuiFolder.add(this.optionsInstance, 'requestChangeUserName');
      this.debugGuiFolder.add(this.optionsInstance, 'getAllUsers');
    } catch (e) {
      console.log('Debug folder already exists');
    }
    this.socket.on('connection', (player) => {
      this.showMessage(`Player: ${player} disconnected.`);
    });
    this.socket.on('disconnect', (player) => {
      this.showMessage(`Player: ${player} disconnected.`);
    });
    this.socket.on('status', (message) => {
      this.showMessage(message);
    });
    this.socket.on('errorStatus', (errorMessage) => {
      this.showError(errorMessage);
    });
    this.socket.on('getAllUserNames', (userNames) => {
      console.log(userNames);
    });
    this.socket.on('nameChangeOK', (newName) => {
      this.data.set('userName', newName);
      this.showMessage(`Server allowed name change to: ${newName}`);
    });

    this.events.on(
      'changedata-userName',
      (parent, value) => {
        this.userNameText.setText(value);
        // this.socket.emit('changeName', value);
      },
      this
    );
  }

  update() {}

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
}
export default NetcodeDebugScene;
