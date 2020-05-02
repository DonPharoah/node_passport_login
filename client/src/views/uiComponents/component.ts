import UIScenePhaser from '../uiScenePhaser';

class Component extends Phaser.GameObjects.Container {
  protected preferredRectangle: Phaser.GameObjects.Shape;
  public rectangle: Phaser.GameObjects.Shape;

  public constructor(scene: UIScenePhaser, x: number, y: number) {
    super(scene, x, y);
    //scene.add.existing(this);
  }

  protected cloneRectangle(
    scene: UIScenePhaser,
    rectangle: Phaser.GameObjects.Shape
  ): Phaser.GameObjects.Rectangle {
    const { x, y, width, height, fillColor, fillAlpha } = rectangle;
    const newRactangle = new Phaser.GameObjects.Rectangle(scene, x, y, width, height, fillColor, fillAlpha);
    return newRactangle;
  }
}
export default Component;
