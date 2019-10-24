import * as Phaser from 'phaser';
import MainScene from './scenes/mainScene';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'RTS Game',
  input: { mouse: true },
  width: window.innerWidth,
  height: window.innerHeight,
  type: Phaser.HEADLESS,
  autoFocus: false,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [MainScene],
  parent: 'game',
  backgroundColor: '#000'
};

const game = new Phaser.Game(gameConfig);
// @ts-ignore
window.gameLoaded();
