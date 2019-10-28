import * as dat from 'dat.gui';
import MainScene from '../scenes/mainScene';

let debugGuiFolder;
let debugFunctionsFolder;
let optionsInstance;
const debugGui = new dat.GUI({ name: 'debugGui', width: 350 });

const initDebugGui_sceneSelect = (game) => {
  let stopAllScenes = () => game.scene.getScenes(true).forEach((currentScene) => currentScene.scene.stop());
  let options = {
    startMainScene: function() {
      stopAllScenes();
      game.scene.start('mainScene');
    },
    startDebugScene: function() {
      stopAllScenes();
      game.scene.start('debugScene');
    }
  };
  debugGui.add(options, 'startMainScene');
  // debugGui.add(options, 'startDebugScene');
};

const debugGuiOptions = function(context: MainScene) {
  this.genericInput = 'defaultText';
  this.sendMessageEvent = () => context.showMessage(this.genericInput);
  this.sendTestErrorEvent = () => context.showError(this.genericInput);
  this.requestChangeUserName = () => context.socket.emit('changeName', this.genericInput);
  this.setUserName = () => context.data.set('userName', this.genericInput);
  this.getAllUsers = () => context.socket.emit('getAllUserNames');
  this.connect = () => context.socket.connect();
  this.disconnect = () => context.socket.emit('playerDisconnect');
  this.startPingServer = () => context.startPingServer();
  this.stopPingServer = () => context.stopPingServer();
};

const initDebugGui_sceneCommands = (sceneContext) => {
  optionsInstance = new debugGuiOptions(sceneContext);
  debugGuiFolder = debugGui.addFolder('Debug Gui');
  debugGuiFolder.add(optionsInstance, 'genericInput');
  debugFunctionsFolder = debugGuiFolder.addFolder('Debug Functions');
  debugFunctionsFolder.add(optionsInstance, 'sendMessageEvent');
  debugFunctionsFolder.add(optionsInstance, 'sendTestErrorEvent');
  debugFunctionsFolder.add(optionsInstance, 'setUserName');
  debugFunctionsFolder.add(optionsInstance, 'requestChangeUserName');
  debugFunctionsFolder.add(optionsInstance, 'getAllUsers');
  debugFunctionsFolder.add(optionsInstance, 'connect');
  debugFunctionsFolder.add(optionsInstance, 'disconnect');
  debugFunctionsFolder.add(optionsInstance, 'startPingServer');
  debugFunctionsFolder.add(optionsInstance, 'stopPingServer');
};
export { debugGui, initDebugGui_sceneSelect, initDebugGui_sceneCommands };
