import { initGridTable } from './modules/gridTable';
import { initTextArea } from './modules/textArea';
import { initOverlayTexts } from './modules/overlayTexts';
import GuiController, { getGuiController } from '../controllers/guiController';
import UIPlugin from '../../vendorModules/rex-ui/templates/ui/ui-plugin';
type rexUi = UIPlugin;

class UIScene extends Phaser.Scene {
  [rexUi: string]: rexUi;
  private guiController: GuiController;
  constructor() {
    super({ key: 'uiScene', active: true, visible: true });
  }
  preload() {
    // this.load.scenePlugin({
    //   key: 'rexuiplugin',
    //   url:
    //     'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexuiplugin.min.js',
    //   sceneKey: 'rexUI'
    // });
  }
  create() {
    this.registry.set('userName', 'Default User Name');
    this.guiController = getGuiController();
    initOverlayTexts(this);
    initGridTable(this);
    initTextArea(this);
  }
}

export default UIScene;
