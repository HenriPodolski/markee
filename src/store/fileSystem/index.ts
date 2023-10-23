import {
  AsyncThunk,
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';
import { walkDirCallback } from '../../hooks/useFileSystemFetch';
import { RootState } from '../index';
import { FileSystemSortedByEnum, FileSystemTypeEnum } from './fileSystem.enums';

export interface FileSystemState {
  value: FileSystemItem[];
  status: string;
}

export const fetchFileSystem: AsyncThunk<any, void, any> = createAsyncThunk(
  'fileSystem/fetch',
  async () => {
    const data = await walkDirCallback();
    return data ?? ([] as FileSystemItem[]);
  }
);

export const fileSystemSlice = createSlice({
  name: 'fileSystem',
  initialState: {
    value: [] as FileSystemItem[],
    status: 'idle',
    error: null as string | null,
  },
  reducers: {
    add: (state, action) => {
      state.value = [...state.value, action.payload];
    },
    remove: (state, action) => {
      state.value = [
        ...state.value.filter((item) => item.id !== action.payload),
      ];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchFileSystem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFileSystem.fulfilled, (state, action) => {
        state.value = action.payload;
        state.status = 'succeded';
      })
      .addCase(fetchFileSystem.rejected, (state, action) => {
        state.status = 'failed';
        // @ts-ignore
        state.error = action?.error?.message;
      });
  },
});

export const { add, remove } = fileSystemSlice.actions;

export const selectFileSystem = (state: RootState) => state.fileSystem;
export const selectFileSystemItems = createSelector(
  [selectFileSystem],
  (state) => state.value
);
export const selectFileSystemItemsByBasePathInOrder = (
  currentBasePath: string,
  sortedBy: FileSystemSortedByEnum = FileSystemSortedByEnum.time
) =>
  createSelector([selectFileSystemItems], (state) => {
    return state
      .filter((item) => {
        return (
          item.basePath ===
          (currentBasePath !== '/' ? `${currentBasePath}/` : '/')
        );
      })
      .sort((a, b) => {
        if (sortedBy === FileSystemSortedByEnum.alphabetical && a.name > b.name)
          return 1;
        if (sortedBy === FileSystemSortedByEnum.alphabetical && a.name < b.name)
          return -1;
        if (
          sortedBy === FileSystemSortedByEnum.time &&
          new Date(a.modified).getTime() > new Date(b.modified).getTime()
        )
          return -1;
        if (
          sortedBy === FileSystemSortedByEnum.time &&
          new Date(a.modified).getTime() < new Date(b.modified).getTime()
        )
          return 1;
        return 0;
      })
      .sort((a) => {
        if (a.type === FileSystemTypeEnum.directory) return -1;
        if (a.type === FileSystemTypeEnum.file) return 1;
        return 0;
      });
  });
export default fileSystemSlice.reducer;
