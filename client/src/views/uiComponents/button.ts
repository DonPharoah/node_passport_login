import Component, { ComponentPreferences } from './component';
import UIScenePhaser from '../uiScenePhaser';
export interface ButtonOptions extends ComponentPreferences {
  onClick?: () => void;
  name: string;
}

class Button extends Component {
  static _defaultColor: number = 0xffffff;
  static _cursorHighlightColor: number = 0xff0000;
  static counter: number = 1;
  static tooltipText: string = 'Tooltip: This is a button';
  static tooltip: { text: Phaser.GameObjects.Text; box: Phaser.GameObjects.Rectangle };
  static tooltipTextStyle = {
    font: '18px Arial',
    fill: '#fff',
    boundsAlignH: 'middle',
    boundsAlignV: 'middle',
  };

  public text: Phaser.GameObjects.Text;
  private onClick;

  public constructor(scene: UIScenePhaser, buttonPreferences: ButtonOptions) {
    super(scene, 0, 0, buttonPreferences);
    this.onClick = buttonPreferences.onClick;
    const { x, y, alignment, height, width } = buttonPreferences;
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
    this.text = scene.add.text(0, 0, buttonPreferences.name, style);
    Button.counter++;
    this.text.setOrigin(0.5, 0.5);
    this.add(this.text);
    this.rectangle.setInteractive();

    let wait: NodeJS.Timeout;

    this.rectangle.on('pointerover', (pointer: Phaser.Input.Pointer) => {
      this.rectangle.fillColor = Button._cursorHighlightColor;
      wait = setTimeout(() => {
        this.showTooltip(scene, pointer.worldX, pointer.worldY);
      }, 500);
    });
    this.rectangle.on('pointerout', (pointer: Phaser.Input.Pointer) => {
      clearTimeout(wait);
      Button.tooltip.text.destroy();
      Button.tooltip.box.destroy();
    });
    this.rectangle.on('pointerout', () => {
      this.rectangle.fillColor = Button._defaultColor;
    });
    this.rectangle.on('pointerdown', () => {
      this.onClick();
    });
  }

  private async showTooltip(scene: UIScenePhaser, x: number, y: number) {
    Button.tooltip.text = scene.add.text(x, y, Button.tooltipText, Button.tooltipTextStyle);
    Button.tooltip.box = scene.add.rectangle(x, y);
  }

  public resize(width: number, height: number) {
    this.rectangle.displayWidth = width;
    this.rectangle.displayHeight = height;
  }
}
export default Button;
