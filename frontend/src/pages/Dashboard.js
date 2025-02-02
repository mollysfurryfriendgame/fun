// Dashboard component: src/components/Dashboard.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMessage } from '../redux/slices';

function Dashboard() {
    const message = useSelector((state) => state.app.message);
    const dispatch = useDispatch();

    return (
        <div>
            <h1>Dashboard</h1>
            <h2>{message}</h2>
            <button onClick={() => dispatch(setMessage('New Message from Dashboard!'))}>
                Update Message
            </button>
        </div>
    );
}

export default Dashboard;
