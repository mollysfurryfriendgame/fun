import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setMessage } from "../redux/slices";


function Dashboard() {
  const message = useSelector((state) => state.app.message);
  const dispatch = useDispatch();




  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome!</h2>
      <h3>{message}</h3>
      <button
        onClick={() => dispatch(setMessage("New Message from Dashboard!"))}
      >
        Update Message
      </button>
      <div>
        <Link to="/game/dog">
          <button style={{ margin: "10px" }}>Play Dog Game</button>
        </Link>
        <Link to="/game/cat">
          <button style={{ margin: "10px" }}>Play Cat Game</button>
        </Link>
        <Link to="/game/horse">
          <button style={{ margin: "10px" }}>Play Horse Game</button>
        </Link>
        <Link to="/game/bunbun">
          <button style={{ margin: "10px" }}>Play Bunbun Game</button>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
