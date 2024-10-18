import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startGame, flyUp, updateGame } from "./../features/gameSlice.js";
import birdImage from "./../assets/Game Objects/bird.gif";
import pipeBackground from "./../assets/Game Objects/pipe-green.png";
import gameOver from "./../assets/UI/gameover.png";
import background from "./../assets/Game Objects/background-day.png";
import clickSound from "./../assets/Sound Efects/wing.mp3";


function App() {
  const dispatch = useDispatch();
  const { bird, pipes, score, isGameOver } = useSelector((state) => state.game);

  const handleClickSound = () => {
    new Audio(clickSound).play();
  };

  const handleFly = () => {
    if (isGameOver) {
      dispatch(startGame());
    } else {
      handleClickSound();
      dispatch(flyUp());
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isGameOver) {
        dispatch(updateGame());
      }
    }, 20);
    return () => clearInterval(interval);
  }, [isGameOver, dispatch]);

  return (
    <div
      className="h-screen flex justify-center items-center"
      onClick={handleFly}
    >
      <div
        className="relative w-full h-full max-w-lg overflow-hidden bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${background})` }}
      >
        <img
          src={birdImage}
          alt="bird"
          className="absolute w-[50px] h-[50px]"
          style={{ top: `${bird.y}px`, left: "50px" }}
        />

        {pipes.map((pipe, index) => (
          <div key={index}>
            <div
              className="absolute w-[60px] bg-cover bg-no-repeat rotate-180"
              style={{
                height: `${pipe.topHeight}px`,
                top: "0px",
                left: `${pipe.x}px`,
                backgroundImage: `url(${pipeBackground})`,
              }}
            ></div>
            <div
              className="absolute w-[60px] bg-cover bg-no-repeat"
              style={{
                height: `${pipe.bottomHeight}px`,
                bottom: "0px",
                left: `${pipe.x}px`,
                backgroundImage: `url(${pipeBackground})`,
              }}
            ></div>
          </div>
        ))}

        <div className="absolute top-4 left-4 text-2xl text-white">{score}</div>

        {isGameOver && (
          <div className="absolute inset-0 flex flex-col gap-10 justify-center items-center text-center bg-black bg-opacity-50 text-white text-3xl">
            <img src={gameOver} alt="game over" />
            <h1>Your score is {score}</h1>
            <h2>Click to restart!</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
