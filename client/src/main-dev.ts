// import * as Phaser from 'phaser';
import { initDebugGui_sceneCommands } from './utils/debugGui';
import { mainConfig } from './phaserConfigs/mainConfig';

// const usernameInput = document.getElementById('username') as HTMLInputElement;
// const loginForm = document.getElementById('login-form');
// const existingToken = localStorage.getItem('token');
// const existingUsername = localStorage.getItem('username');

window.onload = () => {
  // if (existingToken && existingUsername) {
  //   return login('http://localhost:4000/auth/login');
  // } else {
  //   showLogin();
  // }
  hideLogin();
  startGame();
};

// loginForm.addEventListener('submit', async function (e) {
//   e.preventDefault();
//   if (usernameInput.value.length == 0) {
//     throw new Error('Field empty');
//   }
//   signUp('http://localhost:4000/auth/create-user');
//   // hideLogin();
//   // startGame();
// });

// METHODS
// const login = (url) => {
//   fetch(url, {
//     method: 'POST',
//     headers: {
//       Authorization: 'Bearer ' + existingToken,
//       username: localStorage.getItem('username'),
//     },
//   })
//     .then((res) => {
//       if (res.status !== 200) {
//         throw new Error('Failed to authenticate');
//       }
//       return res.json();
//     })
//     .then((json) => {
//       hideLogin();
//       startGame();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

// const signUp = (url) => {
//   fetch(url, {
//     headers: {
//       'Content-Type': 'application/json',
//       username: localStorage.getItem('username'),
//     },
//     method: 'POST',
//     body: JSON.stringify({
//       username: usernameInput.value,
//       token: localStorage.getItem('token'),
//     }),
//   })
//     .then((response) => {
//       if (response.status !== 200 && response.status !== 201) {
//         throw new Error('Could not authenticate.');
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('username', data.username);
//       const remainingMilliseconds = 60 * 60 * 1000;
//       // const remainingMilliseconds = 6000;
//       const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
//       localStorage.setItem('expiryDate', expiryDate.toISOString());
//       setAutoLogout(remainingMilliseconds);
//       hideError();
//       hideLogin();
//       startGame();
//     })
//     .catch((err) => {
//       console.log(err);
//       showError();
//     });
// };

const showLogin = () => (document.getElementById('login').style.display = 'initial');
const hideLogin = () => (document.getElementById('login').style.display = 'none');
const showError = () => (document.getElementById('error-msg').style.display = 'block');
const hideError = () => (document.getElementById('error-msg').style.display = 'none');

const logoutHandler = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expiryDate');
  localStorage.removeItem('username');
};

const setAutoLogout = (milliseconds) => {
  setTimeout(() => {
    logoutHandler();
  }, milliseconds);
};

const startGame = () => {
  const game = new Phaser.Game(mainConfig);
  setTimeout(() => {
    const clientScene = game.scene.getScene('clientScene');
    try {
      initDebugGui_sceneCommands(clientScene);
    } catch (e) {
      console.log('Debug folder already exists');
    }
  }, 100);
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
