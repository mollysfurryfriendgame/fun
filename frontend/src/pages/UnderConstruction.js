import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMessage } from '../redux/slices';

function UnderConstruction() {
    const message = useSelector((state) => state.app.message);
    const dispatch = useDispatch();

    return (
        <div>
            <h1>UnderConstruction</h1>
            <h2>{message}</h2>
            <button onClick={() => dispatch(setMessage('New Message from UnderConstruction!'))}>
                Update Message
            </button>
        </div>
    );
}

export default UnderConstruction;
