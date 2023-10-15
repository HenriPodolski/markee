import { atom } from 'recoil';
import { OpenFileState } from '../../interfaces/OpenFile.interface';

export const openFileState = atom<OpenFileState>({
  key: 'openFileState',
  default: null,
});
