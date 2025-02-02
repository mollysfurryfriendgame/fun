import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMessage } from '../redux/slices';
import { useAuth0 } from "@auth0/auth0-react";

function Upload() {
  const { user } = useAuth0();
  const message = useSelector((state) => state.app.message);
  const dispatch = useDispatch();


  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Upload</h1>
      <h2>Welcome, {user.name}!</h2>
      <h3>{message}</h3>
      <button
        onClick={() => dispatch(setMessage("New Message from Upload!"))}
      >
        Update Message
      </button>
    </div>
  );
}

export default Upload;
