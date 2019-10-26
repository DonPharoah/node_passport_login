import * as Phaser from 'phaser';
import debugGui from './utils/debugGui';
import MainScene from './scenes/mainScene';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'RTS Game',
  input: { mouse: true },
  width: window.innerWidth,
  height: window.innerHeight,
  type: Phaser.AUTO,
  audio: {
    disableWebAudio: false
  },
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

const setupDebugGui = () => {
  let stopAllScenes = () => game.scene.getScenes(true).forEach((currentScene) => currentScene.scene.stop());
  let options = {
    startMainScene: function() {
      stopAllScenes();
      game.scene.start('mainScene');
    },
    startDebugScene: function() {
      stopAllScenes();
      game.scene.start('debugScene');
    }
  };
  debugGui.add(options, 'startMainScene');
  // debugGui.add(options, 'startDebugScene');
};
setupDebugGui();
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
