import { atom } from 'recoil';
import { AppState, Breakpoints } from '../../interfaces/AppState.interface';

export const appState = atom<AppState>({
  key: 'appState',
  default: {
    breakpoint: Breakpoints.xs,
  },
});
