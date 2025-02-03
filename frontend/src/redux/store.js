import { configureStore } from '@reduxjs/toolkit';
import slices from './slices';

const preloadedState = {
    app: {
        message: 'Hello from Redux!',
        accessToken: localStorage.getItem('access_token') || null, // Ensure the key matches what is being set elsewhere
        isSuperUser: (() => {
            try {
                return JSON.parse(localStorage.getItem('is_superuser')) || false;
            } catch {
                return false;
            }
        })(),
    },
};


const store = configureStore({
    reducer: {
        app: slices,
    },
    preloadedState, // Pass preloaded state to the store
});

export default store;
