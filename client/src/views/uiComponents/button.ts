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
  public text: Phaser.GameObjects.Text;

  public constructor(scene: UIScenePhaser, options: ButtonOptions) {
    super(scene, 0, 0);
    const { x, y, horizontalAlignment, verticalAlignment, height, width } = options;
    this.preferredRectangle = new Phaser.GameObjects.Rectangle(scene, x, y, width, height, 0xffffff, 0.5);
    this.rectangle = this.cloneRectangle(scene, this.preferredRectangle);
    //this.text = scene.add.text(0, 0, 'BUTTON');
    this.rectangle.setOrigin(0, 0);
    this.rectangle.setInteractive();
    this.rectangle.on('pointerover', () => {
      //
    });
    this.rectangle.on('pointerout', () => {
      //
    });
    this.rectangle.on('pointerdown', () => {});
  }
}
export default Button;
