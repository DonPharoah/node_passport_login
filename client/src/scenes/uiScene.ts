import initGridTable from '../utils/ui/gridTable';

class UIScene extends Phaser.Scene {
  [rexUi: string]: any;
  public testBtn: Phaser.GameObjects.Sprite;
  public row;
  public buttons: any;
  public text: Phaser.GameObjects.Text;
  constructor() {
    super({ key: 'uiScene', active: true, visible: true });
  }
  // preload() {
  //   this.load.image('testBtn', 'assets/ui/buttons/testBtn.png');
  // }
  create() {
    initGridTable(this);
  }
  update() {}
}

export default UIScene;
