const game = document.getElementById('game');
const instructionsDisplay = document.getElementById('game-instructions');
const timeDisplay = document.getElementById('game-time');
const winDisplay = document.getElementById('game-win');
const loseDisplay = document.getElementById('game-lose');

const GAME_START_WAIT = 5000;
const GAME_END_WAIT = 5000;
const GAME_DURATION = 60;
const TICK_TIME = 1500;

let gameInited = false;
let gameOn = false;
let intersecting = false;
let timeTick = null;
let preGameTimeout = null;

let gameTime = GAME_DURATION;

const endGame = () => {
  clearInterval(timeTick);
  setTimeout(() => game.hidden = true, GAME_END_WAIT);
  instructionsDisplay.hidden = true;
  timeDisplay.hidden = true;
}

const winGame = () => {
  // console.log('winning game');
  endGame();
  winDisplay.hidden = false;
};

const loseGame = () => {
  // console.log('losing game');
  endGame();
  loseDisplay.hidden = false;
}

export const initGame = () => {
  if (gameInited) {
    return;
  }

  gameInited = true;
  // console.log('initialising game');
  timeDisplay.innerText = GAME_DURATION;

  timeTick = setInterval(() => {
    if (!gameOn) {
      if (!intersecting) {
        // console.log('game not on, and not intersecting anymore');
        clearTimeout(preGameTimeout);
        preGameTimeout = null;
        return;
      }

      // console.log('game not on, and still intersecting');
      return;
    }

    if (!intersecting) {
      loseGame();
    }

    if (gameTime <= 1) {
      winGame();
    }

    timeDisplay.innerText = gameTime--;
    intersecting = false;
  }, TICK_TIME);
};

const startGame = () => {
  // console.log('starting the game');
  gameOn = true;
  game.hidden = false;
};

export const onGameIntersect = () => {
  if (!gameInited) {
    return;
  }

  if (!gameOn && !preGameTimeout) {
    // console.log('waiting 5 seconds to start the game');
    preGameTimeout = setTimeout(startGame, GAME_START_WAIT);
  }

  intersecting = true;
};
