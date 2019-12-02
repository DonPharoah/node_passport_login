// import UIScene from '../views/uiScene';
// import ClientScene from '../scenes/clientScene';
// import { getBuildingPanel } from '../views/modules/gridTable';
// import { getCurrentSelectedPanel } from '../views/modules/textArea';
// import { getOverlayTexts } from '../views/modules/overlayTexts';

// let guiController: GuiController;

// class GuiController {
//   private clientScene: ClientScene;
//   private uiScene: UIScene;
//   private textArea;
//   private gridTable;
//   private overlayTexts;
//   constructor(clientScene, uiScene) {
//     this.uiScene = uiScene;
//     this.clientScene = clientScene;
//     this.overlayTexts = getOverlayTexts();
//     this.gridTable = getBuildingPanel();
//     this.textArea = getTextArea();
//   }
// }

// const initGuiController = (game) => {
//   guiController = new GuiController(
//     game.scene.getScene('mainScene') as ClientScene,
//     game.scene.getScene('uiScene') as UIScene
//   );
//   return guiController;
// };
// const getGuiController = () => {
//   if (guiController) {
//     return guiController;
//   } else {
//     throw new Error('Guicontroller not yet defined');
//   }
// };

// export { initGuiController, getGuiController };
// export default GuiController;
