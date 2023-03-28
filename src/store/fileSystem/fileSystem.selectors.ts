import { selector, selectorFamily } from 'recoil';
import { fileSystemState } from './fileSystem.atoms';
import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';
import { FileSystemSortedByEnum, FileSystemTypeEnum } from './fileSystem.enums';

export const fileSystemTreeSelector = selectorFamily({
  key: 'fileSystemTreeSelector',
  get:
    (
      currentBasePath: string,
      sortedBy: FileSystemSortedByEnum = FileSystemSortedByEnum.time
    ) =>
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
          if (
            sortedBy === FileSystemSortedByEnum.alphabetical &&
            a.name > b.name
          )
            return 1;
          if (
            sortedBy === FileSystemSortedByEnum.alphabetical &&
            a.name < b.name
          )
            return -1;
          if (
            sortedBy === FileSystemSortedByEnum.time &&
            a.modified > b.modified
          )
            return -1;
          if (
            sortedBy === FileSystemSortedByEnum.time &&
            a.modified < b.modified
          )
            return 1;
          return 0;
        })
        .sort((a) => {
          if (a.type === FileSystemTypeEnum.directory) return -1;
          if (a.type === FileSystemTypeEnum.file) return 1;
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

export const fileSystemActiveItemFolderSelector = selector({
  key: 'fileSystemActiveItemFolderSelector',
  get: ({ get }) => {
    const items = get(fileSystemState);

    const activeItem = items.find((item: FileSystemItem) => {
      return item.active;
    });

    if (activeItem?.type === FileSystemTypeEnum.directory) {
      return activeItem.fullPath;
    }

    return activeItem?.basePath;
  },
});
export const fileSystemOpenFileSelector = selector({
  key: 'fileSystemOpenFileSelector',
  get: ({ get }) => {
    const items = get(fileSystemState);

    return items.find((item: FileSystemItem) => {
      return item.type === FileSystemTypeEnum.file && item.open;
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
