import UIScenePhaser from '../uiScenePhaser';

export interface ComponentPreferences {
  x?: number;
  y?: number;
  alignment?: { horizontal: 'left' | 'center' | 'right'; vertical: 'top' | 'center' | 'bottom' };
  height: number;
  width: number;
}

abstract class Component extends Phaser.GameObjects.Container {
  protected preferredRectangle: Phaser.GameObjects.Shape;
  public rectangle: Phaser.GameObjects.Shape;

  public preferences: ComponentPreferences;

  public constructor(
    scene: UIScenePhaser,
    x?: number,
    y?: number,
    componentPreferences?: ComponentPreferences
  ) {
    super(scene, x, y);
    this.preferences = componentPreferences;
  }

  protected cloneRectangle(
    scene: UIScenePhaser,
    rectangle: Phaser.GameObjects.Shape
  ): Phaser.GameObjects.Rectangle {
    const { x, y, width, height, fillColor, fillAlpha } = rectangle;
    const newRactangle = new Phaser.GameObjects.Rectangle(scene, x, y, width, height, fillColor, fillAlpha);
    return newRactangle;
  }

  public abstract resize(width: number, height: number);
}
export default Component;
