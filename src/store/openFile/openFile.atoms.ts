import { atom } from 'recoil';
import { OpenFileState } from '../../interfaces/OpenFile.interface';
// import { saveOpenFileContent } from './openFile.services';

export const openFileState = atom<OpenFileState>({
  key: 'openFileState',
  default: null,
});
