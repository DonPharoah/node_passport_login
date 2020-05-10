import Component, { ComponentPreferences } from './component';
import Button, { ButtonOptions } from './button';
import UIScenePhaser from '../uiScenePhaser';
import UIScene from '../uiScene';
import TextBox, { TextBoxPreferences } from './textBox';

export interface frameOptions extends ComponentPreferences {
  componentFormat?: 'listing' | 'division';
}

class Frame extends Component {
  private componentGrid: Component[][] = [...Array(9)].map(() => Array(9));
  private currentFormat: (...args) => void;
  private margins: number = 10;

  constructor(scene: UIScenePhaser, framePreferences: frameOptions) {
    super(scene, 0, 0, framePreferences);
    const { x = 0, y = 0, width, height } = framePreferences;
    const positionTopLeftCorner = { x: 0, y: 0 };
    if (framePreferences.componentFormat == 'division') this.currentFormat = this.formatRowByDivision;
    else if (framePreferences.componentFormat == 'listing') this.currentFormat = this.formatRowByListing;
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
    this.rectangle.on('pointerdown', () => {});

    switch (framePreferences.alignment.vertical) {
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

    switch (framePreferences.alignment.horizontal) {
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

  private fitIntoRowDivide(yRow: number, componentToInsert: Component) {}

  private fitIntoRow(
    yRow: number,
    componentToInsert: Component,
    align: 'left' | 'center' | 'right'
  ): boolean {
    const xMax: number = this.componentGrid.length - 1;
    const xCenter: number = xMax / 2;

    if (this.componentGrid[xCenter][yRow] == undefined) {
      this.componentGrid[xCenter][yRow] = componentToInsert;
      0;
      return true;
    }
    for (let i = 1; i <= xCenter; i++) {
      const right: Component = this.componentGrid[xCenter + i][yRow];
      const left: Component = this.componentGrid[xCenter - i][yRow];
      if (right == undefined) {
        if (left == undefined) {
          const component = this.componentGrid[xCenter][yRow];
          this.componentGrid[xCenter][yRow] = undefined;
          this.componentGrid[xCenter - i][yRow] = component;
          this.componentGrid[xCenter + i][yRow] = componentToInsert;
        } else {
          this.componentGrid[xCenter + i][yRow] = componentToInsert;
        }
        return true;
      } else if (left == undefined) {
        this.shiftElementsLeft(xCenter - i, xCenter + i, yRow);
        this.componentGrid[xCenter + i][yRow] = componentToInsert;
        return true;
      }
    }
    return false;
  }

  private shiftElementsLeft(start: number, end: number, rowY: number) {
    for (let x = start; x < end; x++) {
      const component = this.componentGrid[x + 1][rowY];
      this.componentGrid[x][rowY] = component;
      this.componentGrid[x + 1][rowY] = undefined;
    }
  }

  private insertIntoGridAtPosition(componentToInsert: Component, column: number, row: number) {
    this.componentGrid[column][row] = componentToInsert;
  }

  private insertIntoGrid(componentToInsert: Component) {
    const grid: Component[][] = this.componentGrid;
    const xMax = this.componentGrid.length - 1;
    const yMax = this.componentGrid[0].length - 1;
    var left: { x: number; y: number };
    var right: { x: number; y: number };
    var top: { x: number; y: number };
    var bottom: { x: number; y: number };
    const insertingAlign = componentToInsert.preferences.alignment;
    var x, y;
    switch (insertingAlign.vertical) {
      case 'center':
        y = yMax / 2;
        break;
    }
    switch (insertingAlign.horizontal) {
      case 'center':
        x = xMax / 2;
        break;
    }

    const preferredPosition: { x: number; y: number } = { x, y };

    if (x > xMax || y > yMax || x < 0 || y < 0) throw new Error('Invalid index');

    left = x - 1 < 0 ? null : { x: x - 1, y: y };
    right = x + 1 > xMax ? null : { x: x + 1, y: y };
    top = y - 1 < 0 ? null : { x: x, y: y - 1 };
    bottom = y + 1 > yMax ? null : { x: x, y: y + 1 };

    // preffered position is occupied or not
    const existingComponent: Component = grid[preferredPosition.x][preferredPosition.y];
    if (existingComponent) {
      const existingAlign = existingComponent.preferences.alignment;

      switch (existingAlign.vertical) {
        case insertingAlign.vertical: //Same-row resolution
          this.fitIntoRow(preferredPosition.y, componentToInsert, 'center');
          break;
        default:
      }
    } else {
      grid[preferredPosition.x][preferredPosition.y] = componentToInsert;
    }
  }

  private formatGrid() {
    const numberOfColumns = this.componentGrid.length;
    const numberOfRows = this.componentGrid[0].length;

    this.componentGrid.forEach((column, xIndex) => {
      column.forEach((component, yIndex) => {
        const x = this.rectangle.width / numberOfColumns;
        const y = this.rectangle.height / numberOfRows;
        if (component != undefined) {
          component.setPosition(x * xIndex + x / 2, y * yIndex + y / 2);
          //component.resize(x, y);
        }
      });
    });
  }

  private formatRowByListing() {
    const numberOfComponents = this.componentGrid[1].length;
    var xPosition = this.margins;
    for (let i = 0; i < numberOfComponents; i++) {
      const component: Component = this.componentGrid[1][i];
      const pad = 10;
      if (xPosition + pad + component.rectangle.width > this.rectangle.width) {
        this.currentFormat = this.formatRowByDivision;
        break;
      }
      component.setPosition(
        xPosition + component.rectangle.width / 2,
        component.rectangle.y + this.rectangle.height / 2
      );
      xPosition += component.rectangle.width + pad;
    }
  }

  private formatRowByDivision() {
    const numberOfComponents = this.componentGrid[1].length;
    const divisionWidth = this.rectangle.width / numberOfComponents;
    for (let i = 0; i < numberOfComponents; i++) {
      const component: Component = this.componentGrid[1][i];
      component.setPosition(divisionWidth * i + divisionWidth / 2, component.rectangle.y);
      const maxWidth = 120;
      const pad = 20;
      const componentWidth = maxWidth < divisionWidth - pad ? maxWidth : divisionWidth - pad;
      component.setDisplaySize(componentWidth, component.rectangle.height);
    }
  }

  public addTextBox(
    textBoxPreferences: TextBoxPreferences,
    hardPosition?: { column: number; row: number }
  ): TextBox {
    const newTextBox = new TextBox(this.scene as UIScenePhaser, textBoxPreferences);
    this.add(newTextBox);
    if (hardPosition) {
      const { column, row } = hardPosition;
      this.insertIntoGridAtPosition(newTextBox, column, row);
    } else {
      this.insertIntoGrid(newTextBox);
    }
    this.formatGrid();
    return newTextBox;
  }

  public addButton(buttonOptions: ButtonOptions, hardPosition?: { column: number; row: number }): Button {
    const newButton = new Button(this.scene as UIScenePhaser, buttonOptions);
    this.add(newButton);
    if (hardPosition) {
      const { column, row } = hardPosition;
      this.insertIntoGridAtPosition(newButton, column, row);
    } else {
      this.insertIntoGrid(newButton);
    }
    this.formatGrid();
    return newButton;
  }

  public static createHUD(scene: UIScenePhaser): Frame {
    const options: frameOptions = {
      x: 200,
      y: 300,
      width: 1000,
      height: 200,
      componentFormat: 'listing',
      alignment: { horizontal: 'center', vertical: 'bottom' },
    };
    const newFrame = new Frame(scene, options);
    return newFrame;
  }

  public static createYesNoPrompt(
    scene: UIScenePhaser,
    callbackYes: () => void,
    callbackNo?: () => void
  ): Frame {
    const options: frameOptions = {
      x: 200,
      y: 300,
      width: 600,
      height: 180,
      componentFormat: 'listing',
      alignment: { horizontal: 'center', vertical: 'bottom' },
    };
    const newFrame = new Frame(scene, options);
    const yesButtonOptions: ButtonOptions = {
      name: 'YES',
      onClick: () => {
        callbackYes();
        newFrame.destroy();
      },
      height: 50,
      width: 100,
    };
    const noButtonOptions: ButtonOptions = {
      name: 'NO',
      onClick: () => {
        newFrame.destroy();
      },
      height: 50,
      width: 100,
    };
    const yesButton = newFrame.addButton(yesButtonOptions, { column: 3, row: 7 });
    const noButton = newFrame.addButton(noButtonOptions, { column: 5, row: 7 });

    const textBoxOptions: TextBoxPreferences = {
      text: 'ARE YOU SURE ABOUT THAT?',
      width: 500,
      height: 100,
    };
    const textBox = newFrame.addTextBox(textBoxOptions, { column: 4, row: 3 });
    return newFrame;
  }

  public static createTestPrompt(scene: UIScenePhaser, callbackYes: () => void): Frame {
    const options: frameOptions = {
      x: 200,
      y: 300,
      width: 1000,
      height: 200,
      componentFormat: 'listing',
      alignment: { horizontal: 'center', vertical: 'bottom' },
    };
    const newFrame = new Frame(scene, options);
    const testMakeButton = () => {
      const button = newFrame.addButton(yesButtonOptions);
    };
    const yesButtonOptions: ButtonOptions = {
      name: 'BUTTON' + Button.counter,
      onClick: testMakeButton,
      height: 100,
      width: 100,
      alignment: { horizontal: 'center', vertical: 'center' },
    };
    const yesButton = newFrame.addButton(yesButtonOptions);
    //const noButton = newFrame.addButton(yesButtonOptions);

    //newFrame.insertIntoGrid(yesButton);
    //newFrame.insertIntoGrid(noButton);
    return newFrame;
  }

  public static debugFrame(scene: UIScenePhaser) {
    const options: frameOptions = {
      x: 200,
      y: 300,
      width: 1000,
      height: 200,
      componentFormat: 'listing',
      alignment: { horizontal: 'center', vertical: 'bottom' },
    };
    const newFrame = new Frame(scene, options);
  }

  public resize(width, height) {}
}

export default Frame;
