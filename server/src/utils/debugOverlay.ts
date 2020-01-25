import { Server } from 'socket.io';
import ServerScene from '../scenes/serverScene';

class DebugOverlay {
  static debugScene: ServerScene;

  constructor(scene: ServerScene) {
    DebugOverlay.debugScene = scene;
  }

  static setEntityTooltipLines(entity: Entity, elements: any[], writeToLine: (element) => string) {
    const text: string[] = elements.map(writeToLine);
    this.debugScene.sendDebugTooltipForClients(entity, text);
  }
  static setEntityTooltip(entity: Entity, text: string) {
    let setText: string[] = [];
    setText[0] = text;
    this.debugScene.sendDebugTooltipForClients(entity, setText);
  }
}
export default DebugOverlay;
