import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMessage } from '../redux/slices';

function Home() {
    const message = useSelector((state) => state.app.message);
    const dispatch = useDispatch();

    return (
        <div>
            <h1>Homepage</h1>
            <h2>{message}</h2>
            <button onClick={() => dispatch(setMessage('New Message from Home!'))}>
                Update Message
            </button>
        </div>
    );
}

export default Home;
