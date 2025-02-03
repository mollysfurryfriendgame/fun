import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices'; // Import the app slice

const preloadedState = {
    app: {
        message: 'Hello from Redux!',
        accessToken: localStorage.getItem('access_token') || null, // Load access token from localStorage
        isSuperUser: (() => {
            try {
                return JSON.parse(localStorage.getItem('is_superuser')) || false;
            } catch {
                return false;
            }
        })(),
        animals: [], // Preload animals as empty
        selectedCategory: 'dog', // Default category
    },
};

const store = configureStore({
    reducer: {
        app: appReducer, // Add the app slice reducer
    },
    preloadedState, // Pass the preloaded state to the store
});

export default store;
