import * as Phaser from 'phaser';
import { initDebugGui_sceneSelect } from './utils/debugGui';
import MainScene from './scenes/mainScene';

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'RTS Game',
  input: { mouse: true },
  width: window.innerWidth,
  height: window.innerHeight,
  type: Phaser.AUTO,
  audio: {
    disableWebAudio: true
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

initDebugGui_sceneSelect(game);

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
