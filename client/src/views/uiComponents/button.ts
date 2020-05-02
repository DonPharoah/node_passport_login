import Component from './component';
import UIScenePhaser from '../uiScenePhaser';
export interface ButtonOptions {
  onClick?: () => void;
  x?: number;
  y?: number;
  horizontalAlignment?: 'left' | 'center' | 'right';
  verticalAlignment?: 'top' | 'center' | 'bottom';
  height: number;
  width: number;
}

class Button extends Component {
  static _defaultColor: number = 0xffffff;
  static _cursorHighlightColor: number = 0xff0000;

  public text: Phaser.GameObjects.Text;

  public constructor(scene: UIScenePhaser, options: ButtonOptions) {
    super(scene, 0, 0);
    const { x, y, horizontalAlignment, verticalAlignment, height, width } = options;
    this.preferredRectangle = new Phaser.GameObjects.Rectangle(
      scene,
      0,
      0,
      width,
      height,
      Button._defaultColor,
      0.1
    );
    this.rectangle = this.cloneRectangle(scene, this.preferredRectangle);
    this.add(this.rectangle);
    const style = { font: '18px Arial', fill: '#fff', boundsAlignH: 'middle', boundsAlignV: 'middle' };
    //this.text = new Phaser.GameObjects.Text(scene,0,0,"BUTTON",style);
    //this.rectangle.setPosition(0, 0);
    scene.add.existing(this);
    this.text = scene.add.text(0, 0, 'BUTTON', style);
    this.text.setOrigin(0.5, 0.5);
    this.add(this.text);
    this.rectangle.setInteractive();
    this.rectangle.on('pointerover', () => {
      this.rectangle.fillColor = Button._cursorHighlightColor;
    });
    this.rectangle.on('pointerout', () => {
      this.rectangle.fillColor = Button._defaultColor;
    });
    this.rectangle.on('pointerdown', () => {});
  }
}
export default Button;
