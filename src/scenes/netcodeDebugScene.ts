import debugGui from '../utils/debugGui';
import * as io from 'socket.io-client';

class NetcodeDebugScene extends Phaser.Scene {
  public titleText: Phaser.GameObjects.Text;
  public debugText: Phaser.GameObjects.Text;
  private debugGuiFolder;
  private socket: SocketIOClient.Socket;
  constructor() {
    super({ key: 'debugScene', active: false });
  }

  create() {
    this.socket = io('http://localhost:3000');
    this.titleText = this.add.text(20, 20, 'In Debug Scene', { fontSize: '20px' });
    this.debugText = this.add.text(20, 50, 'Testing', { fontSize: '20px' });
    try {
      this.debugGuiFolder = debugGui.addFolder('Debug Gui');
      this.debugGuiFolder.add(
        { sendMessageEvent: () => this.events.emit('debugStatus', 'Hey wuddup') },
        'sendMessageEvent'
      );
    } catch (e) {
      console.log('Debug folder already exists');
    }
    this.socket.on('debugStatus', (message) => {
      this.events.emit('debugStatus', message);
    });
    this.events.on('debugStatus', this.showMessage, this);
  }

  update() {}

  showMessage(message = 'Default text') {
    this.debugText.setText(message);
    this.debugText.alpha = 1;
    this.tweens.killAll();
    this.tweens.add({
      targets: this.debugText,
      alpha: 0,
      duration: 5000,
      ease: 'Quad'
    });
  }
}
export default NetcodeDebugScene;
