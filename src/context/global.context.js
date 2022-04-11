import { createContext } from 'react';
export const globalContextDefault = {
  onCreateNewFile: () => {},
  onSave: () => {},
  isSaving: false,
  html: '',
  fs: null,
  editorFileContent: '',
  editorFileHTML: '',
  editorFileMarkdown: '',
  openFilePath: '',
  updateFileTree: Date.now(),
};
export const GlobalContext = createContext([globalContextDefault]);
