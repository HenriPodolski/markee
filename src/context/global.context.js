import { createContext } from 'react'
export const globalContextDefault = {
    onSave: () => {},
    isSaving: false,
    html: '',
    fs: null
};
export const GlobalContext = createContext(globalContextDefault);
