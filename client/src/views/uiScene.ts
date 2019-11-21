import { initGridTable } from './modules/gridTable';
import { initTextArea } from './modules/textArea';
import { initOverlayTexts } from './modules/overlayTexts';
// import GuiController, { getGuiController, initGuiController } from '../controllers/guiController';
import UIPlugin from '../../vendorModules/rex-ui/templates/ui/ui-plugin';
type rexUi = UIPlugin;

class UIScene extends Phaser.Scene {
  [rexUi: string]: rexUi;
  private textArea;
  private gridTable;
  private overlayTexts;
  // private guiController: GuiController;
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
    this.overlayTexts = initOverlayTexts(this);
    this.gridTable = initGridTable(this);
    this.textArea = initTextArea(this);
    this.registry.events.on('changedata', (parent, key, value) => {
      if (key === 'userName') {
        this.setUsernameText(`Player name: ${value}`);
      }
    });
  }
  public setTextAreaText(newText: string) {
    this.textArea.setText(newText);
  }
  public appendToTextArea(newText: string) {
    this.textArea.appendText(newText + '\n');
  }
  public clearText() {
    this.textArea.setText('');
  }
  public showOverlayMessage(message = 'Default text') {
    console.log(message);
    this.tweens.killTweensOf(this.overlayTexts.debugText);
    this.overlayTexts.debugText.setText(message);
    this.overlayTexts.debugText.alpha = 1;
    this.tweens.add({
      targets: this.overlayTexts.debugText,
      alpha: 0,
      duration: 5000,
      ease: 'Quad'
    });
  }

  public showOverlayError(error = '') {
    console.log(error);
    this.tweens.killTweensOf(this.overlayTexts.errorText);
    this.overlayTexts.errorText.setText(error);
    this.overlayTexts.errorText.alpha = 1;
    this.tweens.add({
      targets: this.overlayTexts.errorText,
      alpha: 0,
      duration: 5000,
      ease: 'Quad'
    });
  }

  public setTitleText(newName: string) {
    this.overlayTexts.titleText.setText(newName);
  }
  public setUsernameText(newName: string) {
    this.overlayTexts.userNameText.setText(newName);
  }

  public setSelectedEntityText(name: string) {
    this.overlayTexts.selectedEntityText.setText(name);
  }
}

export default UIScene;
