import { initMainSizer } from './modules/mainSizer';
import { initBuildingPanel } from './modules/buildingPanel';
import { initCurrentSelectedPanel, showPanel, hidePanel } from './modules/currentSelectedPanel';
import { initOverlayTexts } from './modules/overlayTexts';
import UIPlugin from '../../vendorModules/rex-ui/templates/ui/ui-plugin';
import Entity from '../models/entities/entity';
type rexUi = UIPlugin;

class UIScene extends Phaser.Scene {
  [rexUi: string]: rexUi;
  private mainSizer;
  private currentSelectedPanel;
  private buildingPanel;
  private overlayTexts;
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
    this.mainSizer = initMainSizer(this);
    this.buildingPanel = initBuildingPanel(this);
    this.currentSelectedPanel = initCurrentSelectedPanel(this);

    this.mainSizer
      .add(this.buildingPanel, 0, 'center', 7, true, 'buildingPanel')
      .add(this.currentSelectedPanel, 0, 'center', 7, true, 'currentSelectedPanel')
      .layout();

    this.registry.events.on('changedata', (parent, key, value) => {
      if (key === 'userName') {
        this.setUsernameText(`Player name: ${value}`);
      }
    });
  }

  public onSelectionAmountChanged(currentSelected: { entity: Entity; circle: Phaser.GameObjects.Image }[]) {
    if (currentSelected.length == 0) {
      hidePanel(this);
      return;
    } else {
      showPanel(this);
      if (currentSelected.length == 1) {
        // populate panel with currentSelected[0].entity's data
      } else if (currentSelected.length > 1) {
        // populate panel with preset "Multiple Selected" data
      }
    }
  }
  public setTooltipText(newText: string) {}
  public setTextAreaText(newText: string) {
    this.currentSelectedPanel.getElement('textArea').setText(newText);
  }

  public appendToTextArea(newText: string) {
    this.currentSelectedPanel.getElement('textArea').appendText(newText + '\n');
  }

  public clearText() {
    this.currentSelectedPanel.getElement('textArea').setText('');
  }

  public hideCurrentSelectedPanel() {
    hidePanel(this);
  }

  public showCurrentSelectedPanel() {
    showPanel(this);
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
