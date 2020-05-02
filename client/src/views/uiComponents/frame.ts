import Component from './component';
import Button, { ButtonOptions } from './button';
import UIScenePhaser from '../uiScenePhaser';
import UIScene from '../uiScene';

export interface frameOptions {
  x: number;
  y: number;
  horizontalAlignment?: 'left' | 'center' | 'right';
  verticalAlignment?: 'top' | 'center' | 'bottom';
  height: number;
  width: number;
  componentFormat?: 'listing' | 'division';
}

class Frame extends Component {
  private componentGrid: Component[][] = [[], []];
  private currentFormat: (...args) => void;
  private margins: number = 10;

  constructor(scene: UIScenePhaser, frameOptions: frameOptions) {
    super(scene, 0, 0);
    const { x = 0, y = 0, width, height } = frameOptions;
    const positionTopLeftCorner = { x: 0, y: 0 };
    if (frameOptions.componentFormat == 'division') this.currentFormat = this.formatRowByDivision;
    else if (frameOptions.componentFormat == 'listing') this.currentFormat = this.formatRowByListing;
    this.preferredRectangle = new Phaser.GameObjects.Rectangle(scene, 0, 0, width, height, 0xffffff, 0.1);
    this.rectangle = this.cloneRectangle(scene, this.preferredRectangle);
    this.rectangle.setOrigin(0, 0);
    this.add(this.rectangle);
    this.rectangle.setInteractive();
    this.rectangle.on('pointerover', () => {
      //
    });
    this.rectangle.on('pointerout', () => {
      //
    });
    this.rectangle.on('pointerdown', () => {
      const framePosition: { x: number; y: number } = this.rectangle.getTopLeft();
      const newButton = this.addButton({ x: framePosition.x, y: framePosition.y, width: 20, height: 20 });
      this.addComponentToRow(newButton);
    });

    switch (frameOptions.verticalAlignment) {
      case 'bottom':
        positionTopLeftCorner.y = scene.game.canvas.height - this.rectangle.height;
        break;
      case 'top':
        positionTopLeftCorner.y = 0;
        break;
      case 'center':
        positionTopLeftCorner.y = scene.game.canvas.height / 2 - this.rectangle.height / 2;
        break;
    }

    switch (frameOptions.horizontalAlignment) {
      case 'left':
        positionTopLeftCorner.x = 0;
        break;
      case 'center':
        positionTopLeftCorner.x = scene.game.canvas.width / 2 - this.rectangle.width / 2;
        break;
      case 'right':
        positionTopLeftCorner.x = scene.game.canvas.width - this.rectangle.width;
        break;
    }

    this.setPosition(positionTopLeftCorner.x, positionTopLeftCorner.y);
    this.currentFormat = this.formatRowByListing;

    scene.add.existing(this);
  }

  public addToScene(scene: UIScenePhaser) {
    scene.add.existing(this);
  }

  private addComponentToRow(component: Component) {
    this.componentGrid[1].push(component);
    this.currentFormat();
  }

  private formatRowByListing() {
    const numberOfComponents = this.componentGrid[0].length;
    var xPosition = this.margins;
    for (let i = 0; i < numberOfComponents; i++) {
      const component: Component = this.componentGrid[0][i];
      const pad = 10;
      if (xPosition + pad + component.rectangle.width > this.rectangle.width) {
        this.currentFormat = this.formatRowByDivision;
        break;
      }
      component.setPosition(xPosition + component.rectangle.width / 2, component.rectangle.y);
      xPosition += component.rectangle.width + pad;
    }
  }

  private formatRowByDivision() {
    const numberOfComponents = this.componentGrid[0].length;
    const divisionWidth = this.rectangle.width / numberOfComponents;
    for (let i = 0; i < numberOfComponents; i++) {
      const component: Component = this.componentGrid[0][i];
      component.setPosition(divisionWidth * i + divisionWidth / 2, component.rectangle.y);
      const maxWidth = 120;
      const pad = 20;
      const componentWidth = maxWidth < divisionWidth - pad ? maxWidth : divisionWidth - pad;
      component.setDisplaySize(componentWidth, component.rectangle.height);
    }
  }

  public addButton(buttonOptions: ButtonOptions): Button {
    const newButton = new Button(this.scene as UIScenePhaser, buttonOptions);
    this.add(newButton);
    return newButton;
  }

  public static createYesNoPrompt(scene: UIScenePhaser, callbackYes: () => void): Frame {
    const options: frameOptions = {
      x: 200,
      y: 300,
      width: 400,
      height: 200,
      componentFormat: 'listing',
      verticalAlignment: 'bottom',
      horizontalAlignment: 'center',
    };
    const newFrame = new Frame(scene, options);
    const yesButtonOptions: ButtonOptions = {
      onClick: callbackYes,
      height: 100,
      width: 100,
      horizontalAlignment: 'center',
      verticalAlignment: 'center',
    };
    const yesButton = newFrame.addButton(yesButtonOptions);
    newFrame.addComponentToRow(yesButton);
    return newFrame;
  }
}

export default Frame;
