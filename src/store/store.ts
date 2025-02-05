import { createStore } from 'stan-js';
import { storage } from 'stan-js/storage';

export type Workspace = {
    folder: string;
};

export type CollectionType = 'richtext' | 'rss' | 'link';

export type Collection = {
    folder: CollectionType;
}

export type Notebook = {
    folder: string;
}

export type NoteOutputType = 'markdown' | 'html';

export type Note = {
    outputTypes: Array<NoteOutputType>;
    file: string;
}

export const { actions, getState, reset, effect, useStore, useStoreEffect } = createStore({
    workspaces: [] as Array<Workspace>,
    collections: [] as Array<Collection>,
    notebooks: [] as Array<Notebook>,
    notes: [] as Array<Note>,
    selected: storage<string>('', { storageKey: 'markee:selected' })
})