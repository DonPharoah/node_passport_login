import { createMainSizer } from './modules/mainSizer';
import { createBuildingPanel } from './modules/buildingPanel';
// import { initMultipurposePanel, showPanel, hidePanel } from './modules/multipurposePanel';
import multipurposePanelManager from './modules/multipurposePanel';
import { initOverlayTexts } from './modules/overlayTexts';
// import UIPlugin from '../../vendorModules/rex-ui/templates/ui/ui-plugin';
import { Entity } from '../models/entities/entity';
// type rexUi = UIPlugin;

class UIScene extends Phaser.Scene {
  // [rexUi: string]: rexUi;
  [rexUi: string]: any;
  private mainSizer;
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
    this.mainSizer = createMainSizer(this);

    this.addBuildingPanel();
    this.addMultipurposePanel();

    setTimeout(() => this.mainSizer.layout(), 5000);

    this.registry.events.on('changedata', (parent, key, value) => {
      if (key === 'userName') {
        this.setUsernameText(`Player name: ${value}`);
      }
    });
  }

  public addBuildingPanel() {
    this.mainSizer.add(createBuildingPanel(this), 0, 'center', 7, true, 'buildingPanel');
    this.mainSizer.layout();
  }

  public addMultipurposePanel() {
    this.mainSizer.add(
      multipurposePanelManager.createMultipurposePanel(this),
      0,
      'center',
      7,
      true,
      'multipurposePanel'
    );
    this.mainSizer.layout();
  }

  public clearMultipurposePanelContents() {
    this.getMultipurposePanel().clear(true);
  }

  public clearMultipurposePanel_innerContents() {}

  public removeMultipurposePanel() {
    let mpPanel = this.getMultipurposePanel();
    mpPanel.clear(true);
    this.mainSizer.remove(mpPanel);
    this.mainSizer.layout();
  }

  public removeBuildingPanel() {
    let bPanel = this.getBuildingPanel();
    bPanel.clear(true);
    this.mainSizer.remove(bPanel);
    this.mainSizer.layout();
  }

  public getBuildingPanel(): any {
    let foundPanel = this.mainSizer.getElement('buildingPanel');
    if (!foundPanel) throw new Error('buildingPanel not found!');
    return foundPanel;
  }

  public getMultipurposePanel(): any {
    let foundPanel = this.mainSizer.getElement('multipurposePanel');
    if (!foundPanel) throw new Error('multipurposePanel not found!');
    return foundPanel;
  }

  public onSelectionAmountChanged(currentSelected: { entity: Entity; circle: Phaser.GameObjects.Image }[]) {
    if (currentSelected.length == 0) {
      multipurposePanelManager.hidePanel(this);
      return;
    } else {
      multipurposePanelManager.showPanel(this);
      if (currentSelected.length == 1) {
        // populate panel with currentSelected[0].entity's data
      } else if (currentSelected.length > 1) {
        // populate panel with preset "Multiple Selected" data
      }
    }
  }
  public setTooltipText(newText: string) {}

  // TODO
  public setTextAreaText(newText: string) {
    // this.currentSelectedPanel.getElement('textArea').setText(newText);
  }

  // TODO
  public appendToTextArea(newText: string) {
    // this.currentSelectedPanel.getElement('textArea').appendText(newText + '\n');
  }

  // TODO
  public clearText() {
    // this.currentSelectedPanel.getElement('textArea').setText('');
  }

  public hideMultipurposePanel() {
    multipurposePanelManager.hidePanel(this);
  }

  public showMultipurposePanel() {
    multipurposePanelManager.showPanel(this);
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
      ease: 'Quad',
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
      ease: 'Quad',
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

  public setCurrentUsersText(users: string[]) {
    let usersList = 'Connected Users:\n';
    users.forEach((user) => (usersList += user + '\n'));
    this.overlayTexts.currentUsersText.setText(usersList);
  }
}

export default UIScene;
