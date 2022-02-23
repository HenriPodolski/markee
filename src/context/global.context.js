import { createContext } from 'react';
export const globalContextDefault = {
  onSave: () => {},
  isSaving: false,
  html: '',
  fs: null,
  editorFileContent: '',
  editorFileHTML: '',
  editorFileMarkdown: '',
  openFilePath: '',
};
export const GlobalContext = createContext([globalContextDefault]);
