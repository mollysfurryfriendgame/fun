import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    message: 'Hello from Redux!',
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setMessage: (state, action) => {
            state.message = action.payload;
        },
    },
});

export const { setMessage } = appSlice.actions;
export default appSlice.reducer;
