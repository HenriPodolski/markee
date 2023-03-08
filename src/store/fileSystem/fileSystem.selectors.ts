import { selector, selectorFamily } from 'recoil';
import { fileSystemState } from './fileSystem.atoms';
import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';

export const fileSystemTreeSelector = selectorFamily({
  key: 'fileSystemTreeSelector',
  get:
    (currentBasePath: string) =>
    ({ get }) => {
      const items = get(fileSystemState);

      return items
        .filter((item) => {
          return (
            item.basePath ===
            (currentBasePath !== '/' ? `${currentBasePath}/` : '/')
          );
        })
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
        });
    },
});

export const fileSystemDirectoryChildrenSelector = selectorFamily({
  key: 'fileSystemDirectoryChildrenSelector',
  get:
    (currentDirectoryPath: string) =>
    ({ get }) => {
      const items = get(fileSystemState);

      return items.filter((directoryChildItem: FileSystemItem) => {
        return directoryChildItem.basePath === `${currentDirectoryPath}/`;
      });
    },
});

export const fileSystemOpenFileSelector = selector({
  key: 'fileSystemOpenFileSelector',
  get: ({ get }) => {
    const items = get(fileSystemState);

    return items.find((item: FileSystemItem) => {
      return item.type === 'file' && item.open;
    });
  },
  set: ({ set, get }, newValue) => {
    if (newValue) {
      const updatedValue = newValue as FileSystemItem;
      const items = get(fileSystemState);

      const updateItemIndex = items.findIndex(
        (item) => updatedValue && item.id === updatedValue.id
      );

      items[updateItemIndex] = updatedValue;

      set(fileSystemState, items);
    }
  },
});
