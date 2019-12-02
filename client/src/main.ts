import * as Phaser from 'phaser';
import UIPlugin from '../vendorModules/rex-ui/templates/ui/ui-plugin';
// import UIPlugin from '../rex-ui/plugins/dist/rexuiplugin.min.js';
import { initDebugGui_sceneCommands } from './utils/debugGui';
import ClientScene from './scenes/clientScene';
import UIScene from './views/uiScene';
import TestScene from './views/testScene';

// import { initGuiController } from './controllers/guiController';

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
    parent: 'game'
  },
  audio: {
    disableWebAudio: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [ClientScene, UIScene],
  plugins: {
    scene: [{ key: 'rexUI', plugin: UIPlugin, mapping: 'rexUI', sceneKey: 'rexUI' }]
  },
  parent: 'game',
  backgroundColor: '#000'
};

const game = new Phaser.Game(gameConfig);

// put things here to load AFTER everything else has.
window.onload = () => {
  let clientScene = game.scene.getScene('mainScene') as ClientScene;
  let canvas = document.querySelector('canvas');

  clientScene.handleSockets();
  try {
    initDebugGui_sceneCommands(clientScene);
  } catch (e) {
    console.log('Debug folder already exists');
  }

  // canvas.oncontextmenu = (e) => {
  //   e.preventDefault();
  // };
};

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
