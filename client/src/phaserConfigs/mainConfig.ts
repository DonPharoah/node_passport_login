import ClientScene from '../scenes/clientScene';
import UIScene from '../views/uiScene';
import UIPlugin from '../../vendorModules/rex-ui/templates/ui/ui-plugin';
import UIScenePhaser from '../views/uiScenePhaser';

export const mainConfig: Phaser.Types.Core.GameConfig = {
  title: 'RTS Game',
  input: { mouse: true },
  width: window.innerWidth,
  height: window.innerHeight,
  type: Phaser.AUTO,
  disableContextMenu: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'game',
  },
  audio: {
    disableWebAudio: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scene: [ClientScene, UIScenePhaser],
  plugins: {
    scene: [
      {
        key: 'rexUI',
        plugin: UIPlugin,
        mapping: 'rexUI',
        sceneKey: 'rexUI',
      },
    ],
  },
  parent: 'game',
  backgroundColor: '#000',
  callbacks: {
    preBoot: () => {},
    postBoot: () => {},
  },
};
