import fsPromiseSingleton from '../lib/fs-promise-singleton.ts';
import type { LucideIcon } from 'lucide-react';

const fsPromise = fsPromiseSingleton.getInstance('markee');
const { readFile, writeFile } = fsPromise;

export type ConfigStoreWorkspace = {
    name: string;
    icon: LucideIcon;
    selected: boolean;
};

export type ConfigStoreCollectionType = 'notes' | 'rss';

export type ConfigStoreCollection = {
    name: string;
    icon: LucideIcon;
    expanded: boolean;
    type: ConfigStoreCollectionType;
};

export type ConfigStoreNote = {
    name: string;
    open: boolean;
};

export type ConfigStore = {
    version: string;
    workspaces: { [key: string]: ConfigStoreWorkspace };
    collections: { [key: string]: ConfigStoreCollection };
    notes: { [key: string]: ConfigStoreNote };
};

export const workspaceTemplate: ConfigStoreWorkspace = {
    name: '',
    icon: '',
    selected: false,
} as const;

export const collectionTemplate: ConfigStoreCollection = {
    name: '',
    icon: '',
    expanded: false,
    type: 'notes',
} as const;

export const noteTemplate: ConfigStoreNote = {
    name: '',
    open: false,
} as const;

const initialConfig = async (
    initialFsListState: string[]
): Promise<ConfigStore> => {
    let initialState = null;
    let hasChanged = false;

    try {
        // check if file exists
        const configFileContent = await readFile('/.markee', {
            encoding: 'utf8',
        });
        initialState = JSON.parse(configFileContent as string);
    } catch {}

    if (!initialState) {
        initialState = {
            version: process.env.APP_VERSION ?? '0.0.0',
            workspaces: {},
            collections: {},
            notes: {},
        };
        hasChanged = true;
    }

    if (initialFsListState.length) {
        const workspaceNames = initialFsListState
            .filter((item: string) => item.split('/').length === 2)
            .map((item: string) => item.split('/')[1]);

        if (!initialState.workspaces) {
            initialState.workspaces = {};
        }

        workspaceNames.forEach((workspaceName: string) => {
            if (!initialState.workspaces[`/${workspaceName}`]) {
                initialState.workspaces[`/${workspaceName}`] = structuredClone({
                    ...workspaceTemplate,
                    name: workspaceName,
                });
                hasChanged = true;
            }
        });

        const collectionFolders = initialFsListState.filter(
            (item: string) => item.split('/').length === 3
        );

        if (!initialState.collections) {
            initialState.collections = {};
        }

        collectionFolders.forEach((collectionFolder: string) => {
            const collectionName = collectionFolder.split('/')[2];
            if (!initialState.collections[collectionFolder]) {
                initialState.collections[collectionFolder] = structuredClone({
                    ...collectionTemplate,
                    name: collectionName,
                });
                hasChanged = true;
            }
        });

        const noteFiles = initialFsListState.filter(
            (item: string) => item.split('/').length === 4
        );

        if (!initialState.notes) {
            initialState.notes = {};
        }

        noteFiles.forEach((noteFile: string) => {
            const filenameSplit = noteFile.split('/')[3].split('.');
            // remove file extension
            filenameSplit.pop();
            const noteName = filenameSplit.join('.');
            if (!initialState.notes[noteFile]) {
                initialState.notes[noteFile] = structuredClone({
                    ...noteTemplate,
                    name: noteName,
                });
                hasChanged = true;
            }
        });
    }

    if (hasChanged) {
        try {
            await writeFile('/.markee', JSON.stringify(initialState, null, 2), {
                encoding: 'utf8',
                mode: 0o666,
            });
        } catch {}
    }

    return initialState;
};
const hydrateConfigFromVirtualFs = initialConfig;

export { initialConfig, hydrateConfigFromVirtualFs };
