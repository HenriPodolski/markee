import { selectorFamily } from 'recoil';
import { fileSystemState } from './fileSystem.atoms';

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
