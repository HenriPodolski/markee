import { selector, selectorFamily } from 'recoil';
import { fileSystemState } from './fileSystem.atoms';
import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';
import { FileSystemSortedByEnum, FileSystemTypeEnum } from './fileSystem.enums';
import { openFileState } from '../openFile/openFile.atoms';

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
        .map((item) => {
          return item;
        })
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

export const fileSystemActiveItemDirectorySelector = selector({
  key: 'fileSystemActiveItemDirectorySelector',
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
export const fileSystemItemByIdSelector = selectorFamily({
  key: 'fileSystemItemByIdSelector',
  get:
    (id: string) =>
    ({ get }) => {
      const items = get(fileSystemState);

      return items.find((item: FileSystemItem) => {
        return item.id === id;
      });
    },
});

export const fileSystemItemsMarkedForDeletion = selector({
  key: 'fileSystemItemsMarkedForDeletion',
  get: ({ get }) => {
    const items = get(fileSystemState);

    return items.filter((item: FileSystemItem) => {
      return item.markedForDeletion;
    });
  },
});

export const fileSystemItemOfOpenFileSelector = selector({
  key: 'fileSystemItemOfOpenFileSelector',
  get: ({ get }) => {
    const openFile = get(openFileState);
    const fileSystemItems = get(fileSystemState);
    const foundItem = fileSystemItems.find((item: FileSystemItem) => {
      return openFile?.fileSystemId && item.id === openFile?.fileSystemId;
    });

    return foundItem;
  },
});
