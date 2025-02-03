import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode'; // Ensure jwtDecode is imported

const initialState = {
    accessToken: null, // Store the token here
    animals: [], // Store leaderboard animals here
    isSuperUser: false, // Add initial state for superuser
    message: 'Hello from Redux!',
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;

            try {
                // Decode the JWT token to extract claims
                const decoded = jwtDecode(action.payload);

                // Check for the is_staff claim and update the isSuperUser state
                state.isSuperUser = decoded["https://mffg-api/is_staff"] || false;
            } catch (error) {
                console.error("Failed to decode JWT:", error);
                state.isSuperUser = false; // Ensure default false in case of error
            }
        },
        setMessage: (state, action) => {
            state.message = action.payload; // Update the message
        },
        setAnimals: (state, action) => {
            state.animals = action.payload; // Update animals in state
        },
        setIsSuperUser: (state, action) => {
            state.isSuperUser = action.payload; // Explicitly set superuser state
        },
    },
});

export const { setAccessToken, setMessage, setAnimals, setIsSuperUser } = appSlice.actions;
export default appSlice.reducer;
