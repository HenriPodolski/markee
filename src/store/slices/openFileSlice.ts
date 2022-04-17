import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import fsPromiseSingleton from '../../lib/fsPromiseSingleton';
import config from '../../config';
import { fetchFileSystem } from './fileSystemSlice';
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

export const loadFile = createAsyncThunk(
  'openFile/loadFile',
  async (dispatch, { getState }) => {
    const state = getState() as OpenFileState;
    return await fsPromise.readFile(state.path, {
      encoding: 'utf8',
    });
  }
);

const openFileSlice = createSlice({
  name: 'openFile',
  initialState,
  reducers: {
    load: (state, action: PayloadAction<string>) => {
      state.content = '';
      state.path = action.payload;
      state.loading = true;
    },
    reset: (state) => {
      state.content = '';
      state.path = '';
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadFile.fulfilled, (state, action) => {
      state.content = action.payload as string;
      state.loading = false;
    });
  },
});

export default openFileSlice.reducer;

export const selectOpenFilePath = (state: RootState) => state.openFile.path;
