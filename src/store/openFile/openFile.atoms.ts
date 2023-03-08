import { atom } from 'recoil';
import { OpenFileState } from '../../interfaces/OpenFile.interface';
import { saveOpenFileContent } from './openFile.services';

export const openFileState = atom<OpenFileState>({
  key: 'openFileState',
  default: null,
  effects: [
    ({ onSet }) => {
      onSet(async (openFile) => {
        if (openFile?.path && openFile.content && !openFile.loading) {
          // TODO implement autosave when changing to another editor then react quill
          // await saveOpenFileContent(openFile?.path, openFile?.content);
        }
      });
    },
  ],
});
