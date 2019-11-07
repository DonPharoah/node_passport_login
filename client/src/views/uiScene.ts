import { initGridTable } from './modules/gridTable';
import { initTextArea } from './modules/textArea';
import { initOverlayTexts } from './modules/overlayTexts';
import GuiController, { getGuiController } from '../controllers/guiController';
import UIPlugin from '../../rex-ui/templates/ui/ui-plugin.js';
type rexUi = UIPlugin;

class UIScene extends Phaser.Scene {
  [rexUi: string]: rexUi;
  private guiController: GuiController;
  constructor() {
    super({ key: 'uiScene', active: true, visible: true });
  }
  preload() {}
  create() {
    this.registry.set('userName', 'Default User Name');
    this.guiController = getGuiController();
    initOverlayTexts(this);
    initGridTable(this);
    initTextArea(this);
  }
}

export default UIScene;
