import { configureStore } from '@reduxjs/toolkit';
import slices from './slices';

const store = configureStore({
    reducer: {
        app: slices,
    },
});

export default store;
