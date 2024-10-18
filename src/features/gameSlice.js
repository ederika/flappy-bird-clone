import { createSlice } from "@reduxjs/toolkit";
import hitSound from "./../assets/Sound Efects/hit.mp3";
import dieSound from "./../assets/Sound Efects/die.mp3";
import pointSound from "./../assets/Sound Efects/point.mp3";

const initialState = {
  bird: { x: 50, y: 250, velocity: 0, size: 50 },
  pipes: [],
  score: 0,
  isGameOver: false,
};

const gravity = 0.5;
const jumpPower = -8;
const pipeWidth = 60;
const pipeSpeed = 3;
const birdStartY = 250;
let windowHeight = window.screen.height;

const handlePointSound = () => {
  new Audio(pointSound).play();
};

const handleHitSound = () => {
  new Audio(hitSound).play();
};

const handleDieSound = () => {
  new Audio(dieSound).play();
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startGame: (state) => {
      state.bird.y = birdStartY;
      state.bird.velocity = 0;
      state.score = 0;
      state.pipes = generateInitialPipes(state.score);
      state.isGameOver = false;
    },
    flyUp: (state) => {
      state.bird.velocity = jumpPower;
    },
    updateGame: (state) => {
      if (state.isGameOver) return;

      state.bird.y += state.bird.velocity;
      state.bird.velocity += gravity;

      if (state.bird.y > windowHeight || state.bird.y < 0) {
        state.isGameOver = true;
      }

      state.pipes.forEach((pipe) => {
        if (
          state.bird.y < pipe.topHeight ||
          state.bird.y > windowHeight - pipe.bottomHeight
        ) {
          if (
            state.bird.x < pipe.x + pipeWidth &&
            state.bird.x + state.bird.size > pipe.x
          ) {
            handleHitSound();
            handleDieSound();
            state.isGameOver = true;
          }
        }
      });

      state.pipes = state.pipes.map((pipe) => ({
        ...pipe,
        x: pipe.x - pipeSpeed,
      }));

      if (state.pipes.length > 0 && state.pipes[0].x < -pipeWidth) {
        state.pipes.shift(); 
        state.pipes.push(generatePipe(400, state.score)); 
        state.score += 1;
        handlePointSound();
      }
    },
  },
});

function generatePipe(x, score) {
  const pipeGap = getPipeGap(score);
  const topHeight = Math.random() * (400 - pipeGap) + 50;
  return {
    x: x,
    topHeight: topHeight,
    bottomHeight: windowHeight - topHeight - pipeGap,
  };
}

function getPipeGap(score) {
  const minGap = 120;
  const maxGap = 300;
  const difficultyFactor = 5;

  const calculatedGap = maxGap - score * difficultyFactor;

  return Math.max(calculatedGap, minGap);
}

function generateInitialPipes(score) {
  return [generatePipe(400, score), generatePipe(600, score)];
}

export const { startGame, flyUp, updateGame } = gameSlice.actions;
export default gameSlice.reducer;
