import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessage } from "../redux/slices";


function Game() {
  const message = useSelector((state) => state.app.message);
  const dispatch = useDispatch();




  return (
    <div>
      <h1>Game</h1>
      <h2>This is where the Game will be played with matchups.</h2>
      <h3>{message}</h3>
      <button
        onClick={() => dispatch(setMessage("New Message from Game!"))}
      >
        Update Message
      </button>
    </div>
  );
}

export default Game;
