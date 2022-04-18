import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import fsPromiseSingleton from '../../lib/fsPromiseSingleton';
import config from '../../config';
import { RootState } from '../store';

const fsPromise = fsPromiseSingleton.getInstance(config.fsNamespace);

// Define a type for the slice state
interface OpenFileState {
  content: string;
  path: string;
  loading: boolean;
}

// Define the initial state using that type
const initialState: OpenFileState = {
  content: '',
  path: '',
  loading: false,
};

export const load = createAsyncThunk('openFile/load', async (path: string) => {
  const fileContent = await fsPromise.readFile(path, {
    encoding: 'utf8',
  });

  return {
    fileContent,
    path,
  };
});

const openFileSlice = createSlice({
  name: 'openFile',
  initialState,
  reducers: {
    reset: (state) => {
      state.content = '';
      state.path = '';
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(load.pending, (state, action) => {
      state.content = '';
      state.loading = true;
    });
    builder.addCase(load.fulfilled, (state, action) => {
      state.content = (action.payload.fileContent as string) || '';
      state.path = (action.payload.path as string) || '';
      state.loading = false;
    });
  },
});

export default openFileSlice.reducer;

export const selectOpenFilePath = (state: RootState) => state.openFile.path;
export const selectOpenFileContent = (state: RootState) =>
  state.openFile.content;
export const selectOpenFileLoading = (state: RootState) =>
  state.openFile.loading;
