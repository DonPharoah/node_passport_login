import initGridTable from '../utils/ui/gridTable';
import UIPlugin from '../../rex-ui/templates/ui/ui-plugin.js';
type rexUi = UIPlugin;

class UIScene extends Phaser.Scene {
  [rexUi: string]: rexUi;
  public row;
  public buttons: any;
  public text: Phaser.GameObjects.Text;
  constructor() {
    super({ key: 'uiScene', active: true, visible: true });
  }
  preload() {}
  create() {
    initGridTable(this);
  }
  update() {}
}

export default UIScene;
