import { configureStore } from '@reduxjs/toolkit';
import fileSystemReducer from './slices/fileSystemSlice';
import openFileReducer from './slices/openFileSlice';

export const store = configureStore({
  reducer: {
    // Define a top-level state field named `fileSystem`, handled by `fileSystemReducer`
    fileSystem: fileSystemReducer,
    openFile: openFileReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type
export type AppDispatch = typeof store.dispatch;
