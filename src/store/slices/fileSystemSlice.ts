import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import fsPromiseSingleton from '../../lib/fsPromiseSingleton';
import config from '../../config';
import { uuid } from '../../lib/uuid';
import { RootState } from '../store';
import { FileSystemItem } from '../../models/FileSystemItem.interface';
import { EntityState } from '@reduxjs/toolkit/src/entities/models';

const fsPromise = fsPromiseSingleton.getInstance(config.fsNamespace);

const fileSystemAdapter = createEntityAdapter<FileSystemItem>();

const initialState = {
  ids: [],
  entities: {},
};

const recursiveWalkDir = async (
  dir: string,
  treeList: FileSystemItem[],
  level = -1
) => {
  const currentDir = dir ? dir : '/';
  const dirPath = await fsPromise.readdir(currentDir);
  level++;

  await Promise.all(
    dirPath.map(async (dirPathItem: string) => {
      const currentItem = `${currentDir}${dirPathItem}`;
      let statResponse = await fsPromise.stat(currentItem);

      treeList.push({
        name: dirPathItem,
        id: uuid(),
        fullPath: currentItem,
        basePath: currentDir,
        type: statResponse.isDirectory() ? 'directory' : 'file',
        visible: level < 1,
        open: false,
        level,
      });

      if (statResponse.isDirectory()) {
        await recursiveWalkDir(`${currentItem}/`, treeList, level);
      }
    })
  );

  return treeList;
};

const walkDirCallback = async () => {
  const treelist: FileSystemItem[] = [];
  await recursiveWalkDir('', treelist);
  return treelist;
};

export const fetchFileSystem = createAsyncThunk(
  'fileSystem/fetchFileSystem',
  async () => {
    return await walkDirCallback();
  }
);

const saveFile = async (filePath: string, fileContent: string) => {
  await fsPromise.writeFile(filePath, fileContent, {
    mode: 0o777,
    encoding: 'utf8',
  });
};

const fileSystemSlice = createSlice({
  name: 'fileSystem',
  initialState,
  reducers: {
    fileSystemItemAdd: fileSystemAdapter.addOne,
    fileSystemFileOpen(
      state: EntityState<FileSystemItem>,
      action: PayloadAction<string>
    ) {
      const fileSystemFileOpenId = Object.keys(state.entities).find(
        (fileSystemItemKey) => {
          const fileSystemItem = state.entities[fileSystemItemKey];
          return (
            fileSystemItem &&
            fileSystemItem.type === 'file' &&
            fileSystemItem.open
          );
        }
      );
      const fileSystemItem = state.entities[action.payload];

      if (
        fileSystemFileOpenId &&
        fileSystemItem &&
        fileSystemItem.type === 'file'
      ) {
        const fileSystemItemOpen = state.entities[fileSystemFileOpenId];
        if (fileSystemItemOpen && fileSystemItemOpen.open) {
          fileSystemItemOpen.open = false;
        }
      }

      if (fileSystemItem) {
        fileSystemItem.open = true;
      }
    },
    fileSystemFolderToggle(
      state: EntityState<FileSystemItem>,
      action: PayloadAction<string>
    ) {
      const fileSystemItem = state.entities[action.payload];

      Object.values(state.entities)
        .filter((fileSystemEntity: FileSystemItem | undefined) => {
          return (
            fileSystemEntity &&
            fileSystemItem &&
            `${fileSystemItem?.fullPath}/` === fileSystemEntity.basePath
          );
        })
        .forEach((toggleVisibilityFileSystemItem) => {
          if (toggleVisibilityFileSystemItem) {
            toggleVisibilityFileSystemItem.visible =
              !toggleVisibilityFileSystemItem.visible;
          }
        });
    },
    fileSystemFileSave(
      state: EntityState<FileSystemItem>,
      action: PayloadAction<string>
    ) {
      // get the id of the open file
      const fileSystemFileOpenId = Object.keys(state.entities).find(
        (fileSystemItemKey) => {
          const fileSystemItem = state.entities[fileSystemItemKey];
          return (
            fileSystemItem &&
            fileSystemItem.type === 'file' &&
            fileSystemItem.open
          );
        }
      );

      if (fileSystemFileOpenId && state.entities[fileSystemFileOpenId]) {
        const fileSystemItem: FileSystemItem =
          state.entities[fileSystemFileOpenId]!;
        const filePath = fileSystemItem.fullPath;

        saveFile(filePath, action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFileSystem.fulfilled, (state, action) => {
      fileSystemAdapter.setAll(state, action.payload);
    });
  },
});

export const {
  fileSystemItemAdd,
  fileSystemFileSave,
  fileSystemFileOpen,
  fileSystemFolderToggle,
} = fileSystemSlice.actions;

export default fileSystemSlice.reducer;

export const { selectAll: selectFileSystem } = fileSystemAdapter.getSelectors(
  (state: RootState) => state.fileSystem
);

export const selectSortedFileSystem = createSelector(
  selectFileSystem,
  (items) =>
    items
      .map((item) => item)
      .sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      })
      .sort((a) => {
        if (a.type === 'directory') return -1;
        if (a.type === 'file') return 1;
        return 0;
      })
);

export const selectFileSystemByBasePath: any = createSelector(
  [selectSortedFileSystem, (state, basePath) => basePath],
  (items, basePath) =>
    items.filter((item) => {
      return item.basePath === (basePath !== '/' ? `${basePath}/` : '/');
    })
);
