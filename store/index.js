import { configureStore } from '@reduxjs/toolkit';
import repositoriesReducer from './slices/repositoriesSlice';
import favoritesReducer from './slices/favoritesSlice';

const store = configureStore({
  reducer: {
    repositories: repositoriesReducer,
    favorites: favoritesReducer,
  },
});

export default store;
