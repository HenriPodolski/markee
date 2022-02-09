import { createContext } from 'react';
export const globalContextDefault = {
  onSave: () => {},
  isSaving: false,
  html: '',
  fs: null,
  editorFileContent: '',
};
export const GlobalContext = createContext([globalContextDefault]);
