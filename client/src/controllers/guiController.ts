import UIScene from '../views/uiScene';
import ClientScene from '../scenes/clientScene';
import { getGridTable } from '../views/modules/gridTable';
import { getTextArea } from '../views/modules/textArea';
import { getOverlayTexts } from '../views/modules/overlayTexts';

let guiController: GuiController;

class GuiController {
  private clientScene: ClientScene;
  private uiScene: UIScene;
  private textArea;
  private gridTable;
  private overlayTexts;
  constructor(clientScene, uiScene) {
    this.uiScene = uiScene;
    this.clientScene = clientScene;
    this.overlayTexts = getOverlayTexts();
    this.gridTable = getGridTable();
    this.textArea = getTextArea();
    uiScene.registry.events.on('changedata', (parent, key, value) => {
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
    this.uiScene.tweens.killTweensOf(this.overlayTexts.debugText);
    this.overlayTexts.debugText.setText(message);
    this.overlayTexts.debugText.alpha = 1;
    this.uiScene.tweens.add({
      targets: this.overlayTexts.debugText,
      alpha: 0,
      duration: 5000,
      ease: 'Quad'
    });
  }

  public showOverlayError(error = '') {
    console.log(error);
    this.uiScene.tweens.killTweensOf(this.overlayTexts.errorText);
    this.overlayTexts.errorText.setText(error);
    this.overlayTexts.errorText.alpha = 1;
    this.uiScene.tweens.add({
      targets: this.overlayTexts.errorText,
      alpha: 0,
      duration: 5000,
      ease: 'Quad'
    });
  }

  public setUsernameText(newName: string) {
    this.overlayTexts.userNameText.setText(newName);
  }

  public setSelectedEntityText(name: string) {
    this.overlayTexts.selectedEntityText.setText(name);
  }
}

const initGuiController = (game) => {
  guiController = new GuiController(
    game.scene.getScene('mainScene') as ClientScene,
    game.scene.getScene('uiScene') as UIScene
  );
};
const getGuiController = () => guiController;

export { initGuiController, getGuiController };
export default GuiController;
