import { atom } from 'recoil';
import { AppState } from '../../interfaces/AppState.interface';

export const appState = atom<AppState>({
  key: 'appState',
  default: null,
});
