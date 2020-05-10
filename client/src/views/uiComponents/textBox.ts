import Component, { ComponentPreferences } from './component';
import UIScenePhaser from '../uiScenePhaser';

export interface TextBoxPreferences extends ComponentPreferences {
  text: string;
}

class TextBox extends Component {
  public static _defaultColor = 0xffffff;
  private text: Phaser.GameObjects.Text;

  constructor(scene: UIScenePhaser, textBoxPreferences: TextBoxPreferences) {
    super(scene);
    this.preferences = textBoxPreferences;
    this.preferredRectangle = new Phaser.GameObjects.Rectangle(
      scene,
      0,
      0,
      textBoxPreferences.width,
      textBoxPreferences.height,
      TextBox._defaultColor,
      0.1
    );
    this.rectangle = this.cloneRectangle(scene, this.preferredRectangle);
    scene.add.existing(this);
    const style = { font: '22px Arial', fill: '#fff', boundsAlignH: 'middle', boundsAlignV: 'middle' };
    this.text = scene.add.text(0, 0, textBoxPreferences.text, style);
    this.text.style.setWordWrapWidth(this.rectangle.width).setAlign('center');
    this.text.setOrigin(0.5, 0.5);
    this.add(this.rectangle).add(this.text);
  }

  resize() {}
}

export default TextBox;
