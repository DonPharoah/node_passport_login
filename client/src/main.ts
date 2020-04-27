import * as Phaser from 'phaser';
// import UIPlugin from '../vendorModules/rex-ui/templates/ui/ui-plugin';
import UIPlugin from '../vendorModules/rex-ui/templates/ui/ui-plugin';
import { initDebugGui_sceneCommands } from './utils/debugGui';
import ClientScene from './scenes/clientScene';
import UIScene from './views/uiScene';
// import TestScene from './views/testScene';

// import { initGuiController } from './controllers/guiController';
// window.onload = () => {
const gameConfig: Phaser.Types.Core.GameConfig = {
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
  scene: [ClientScene, UIScene],
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
};

const game = new Phaser.Game(gameConfig);
setTimeout(() => {
  const clientScene = game.scene.getScene('clientScene') as ClientScene;
  try {
    initDebugGui_sceneCommands(clientScene);
  } catch (e) {
    console.log('Debug folder already exists');
  }
}, 100);
// };

// put things here to load AFTER everything else has.
// window.onload = () => {};
/*
    ( uwu *pounces you* )

            ("`-''-/").___..--''"`-._        -- -
            `u  u  )   `-.  (     ).`-.__.`) ====-- -
            (_W_.)'  ._   )  `_   `\ ``-..-'   ==-- -
            ((((.-''  ((((.'\       \      --- -
                       -     "-_ _   \
      -                         / F   )
                    -     -    / / `--'
               -              / /
                    -        / /
             -            __/ /
                         /,-pJ
            -        _--"-L ||
                   ,"      "//
      -           /  ,-""".//\
                 /  /     // J____
                J  /     // L/----\
    .           F J     //__//^---'
      `     ___J  F    '----| |
           J---|  F         F F
     `. `   `--J  L        J  F
     .   .`     L J       J  F
        .  .    J  \    ,"  F
          .  `.` \  "--"  ,"
             ` ``."-____-"
             
*/
