import { selector } from 'recoil';
import { appState } from './app.atoms';

export const createFileSelector = selector({
  key: 'createFileSelector',
  get: ({ get }) => {
    const app = get(appState);

    return app?.createFile;
  },
});

export const createFolderSelector = selector({
  key: 'createFolderSelector',
  get: ({ get }) => {
    const app = get(appState);

    return app?.createFolder;
  },
});
