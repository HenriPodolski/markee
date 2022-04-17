import { createContext } from 'react';
export const globalContextDefault = {
  onCreateNewFile: () => {},
  onSave: () => {},
  onNewFile: () => {},
  isSaving: false,
  html: '',
  fs: null,
  focusedFolder: null,
  editorFileContent: '',
  editorFileHTML: '',
  editorFileMarkdown: '',
  openFilePath: '',
  updateFileTree: Date.now(),
};
export const GlobalContext = createContext([globalContextDefault]);
