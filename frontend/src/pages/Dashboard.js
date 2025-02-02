import React from "react";
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
    </div>
  );
}

export default Dashboard;
