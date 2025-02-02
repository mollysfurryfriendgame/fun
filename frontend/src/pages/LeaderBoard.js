import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMessage } from '../redux/slices';

function Leaderboard() {
    const message = useSelector((state) => state.app.message);
    const dispatch = useDispatch();

    return (
        <div>
            <h1>Leaderboard</h1>
            <h2>{message}</h2>
            <button onClick={() => dispatch(setMessage('New Message from Leaderboard!'))}>
                Update Message
            </button>
        </div>
    );
}

export default Leaderboard;
