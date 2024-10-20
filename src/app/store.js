import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./../features/gameSlice.js"; 

export const store = configureStore({
  reducer: {
    game: gameReducer,
  },
});

export default store;
