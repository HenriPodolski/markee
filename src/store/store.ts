import { useCallback, useMemo } from 'react';
import { editorEmptyTemplate, initialFsList } from './fs-store-initial.ts';
import fsPromiseSingleton from '../lib/fs-promise-singleton.ts';
import { createUseStore } from '../lib/create-store.ts';
import {
    collectionTemplate,
    ConfigStore,
    ConfigStoreCollection,
    ConfigStoreNote,
    ConfigStoreWorkspace,
    initialConfig,
    noteTemplate,
    workspaceTemplate,
} from './config-store-initial.ts';
import { SerializedEditorState } from 'lexical';

const fsPromise = fsPromiseSingleton.getInstance('markee');
const { mkdir, writeFile, readFile, stat, rename, unlink, rmdir } = fsPromise;

const initialFsListState = [...(await initialFsList())];
const initialConfigState = await initialConfig(initialFsListState);
let featureFlagState = {};

try {
    featureFlagState = JSON.parse(process?.env?.FEATURE_FLAGS as string);
} catch {
    /* do noting, fail silently */
}

const useConfigStore = createUseStore<ConfigStore>({ ...initialConfigState });
const useFeatureFlagStore = createUseStore<typeof featureFlagState>({
    ...featureFlagState,
});

export const useFeatureFlags = () => {
    const [featureFlags] = useFeatureFlagStore();

    return {
        featureFlags,
    };
};

export const useMarkee = () => {
    const [config, setConfig] = useConfigStore();

    const removeWorkspace = async (workspaceName: string) => {
        const workspaceFolder = `/${workspaceName}`;
        const workspacesState = structuredClone(config.workspaces);

        // check if this is the last remaining workspace, if yes this cannot be deleted
        if (Object.keys(workspacesState).length > 1) {
            // check if empty
            let notesState = structuredClone(config.notes);
            let collectionsState = structuredClone(config.collections);
            const notesToUnlink: string[] = [];
            const collectionsToRemove: string[] = [];
            notesState = Object.fromEntries(
                Object.entries(notesState).filter(([key]) => {
                    if (key.startsWith(workspaceFolder)) {
                        notesToUnlink.push(key);
                    }

                    return !notesToUnlink.includes(key);
                })
            );

            for (const noteFilePath of notesToUnlink) {
                if ((await stat(noteFilePath)).isFile()) {
                    await unlink(noteFilePath);
                }
            }

            collectionsState = Object.fromEntries(
                Object.entries(collectionsState).filter(([key]) => {
                    if (key.startsWith(workspaceFolder)) {
                        collectionsToRemove.push(key);
                    }

                    return !collectionsToRemove.includes(key);
                })
            );

            for (const collectionPath of collectionsToRemove) {
                if ((await stat(`${collectionPath}/.gitkeep`)).isFile()) {
                    await unlink(`${collectionPath}/.gitkeep`);
                }

                if ((await stat(collectionPath)).isDirectory()) {
                    await rmdir(collectionPath);
                }
            }

            if ((await stat(`${workspaceFolder}/.gitkeep`)).isFile()) {
                await unlink(`${workspaceFolder}/.gitkeep`);
            }

            if ((await stat(workspaceFolder)).isDirectory()) {
                await rmdir(workspaceFolder);
            }

            delete workspacesState[workspaceFolder];

            setConfig({
                ...config,
                workspaces: workspacesState,
                collections: collectionsState,
                notes: notesState,
            });
        }
    };

    const createWorkspace = async (workspaceName: string) => {
        const workspaceFolder = `/${workspaceName}`;
        await mkdir(workspaceFolder);
        await writeFile(`${workspaceFolder}/.gitkeep`, '', {
            encoding: 'utf8',
            mode: 0o666,
        });
        const workspacesState = structuredClone(config.workspaces);
        workspacesState[workspaceFolder] = {
            ...structuredClone(workspaceTemplate),
            name: workspaceName,
        };
        setConfig({ ...config, workspaces: workspacesState });
    };

    const workspaces: ConfigStore['workspaces'] =
        useMemo((): ConfigStore['workspaces'] => {
            return structuredClone(config.workspaces);
        }, [config.workspaces]);

    const setActiveWorkspace = (
        itemFolder: string,
        itemValue: ConfigStoreWorkspace
    ) => {
        (itemValue as ConfigStoreWorkspace).selected = true;
        setConfig({
            ...config,
            workspaces: {
                ...Object.fromEntries(
                    Object.entries(config.workspaces).map(([key, val]) => {
                        (val as ConfigStoreWorkspace).selected = false;
                        return [key, val];
                    })
                ),
                [itemFolder]: itemValue,
            },
        });
    };

    const moveWorkspace = async (
        workspace: ConfigStore['workspaces'],
        destWorkspaceName: string
    ) => {
        const oldWorkspaceFolder = Object.keys(workspace)?.[0];
        const destWorkspaceFolder = `/${destWorkspaceName}`;
        await rename(oldWorkspaceFolder, destWorkspaceFolder);
        // get all files that start with workspace
        let notesState = structuredClone(config.notes);
        notesState = Object.fromEntries(
            Object.entries(notesState).map(([key, value]) => {
                if (key.startsWith(oldWorkspaceFolder)) {
                    key = key.replace(oldWorkspaceFolder, destWorkspaceFolder);
                }

                return [key, value];
            })
        );

        // get all collections that start with workspace
        let collectionsState = structuredClone(config.collections);
        collectionsState = Object.fromEntries(
            Object.entries(collectionsState).map(([key, value]) => {
                if (key.startsWith(oldWorkspaceFolder)) {
                    key = key.replace(oldWorkspaceFolder, destWorkspaceFolder);
                }

                return [key, value];
            })
        );

        // finally update workspaces
        const workspacesState = structuredClone(config.workspaces);
        delete workspacesState[oldWorkspaceFolder];

        workspacesState[destWorkspaceFolder] = {
            ...Object.values(workspace)?.[0],
            name: destWorkspaceName,
        };
        setConfig({
            ...config,
            workspaces: workspacesState,
            collections: collectionsState,
            notes: notesState,
        });
    };

    const activeWorkspace = useMemo((): ConfigStore['workspaces'] => {
        let workspace = Object.fromEntries(
            Object.entries(config.workspaces).filter(
                ([, item]) => (item as ConfigStoreWorkspace).selected
            )
        ) as ConfigStore['workspaces'];

        if (!workspace || !Object.values(workspace)?.length) {
            workspace = Object.fromEntries(
                Object.entries(config.workspaces)
                    .filter(([], index) => index === 0)
                    .map(([key, workspace]) => {
                        (workspace as ConfigStoreWorkspace).selected = true;
                        return [key, workspace];
                    })
            ) as ConfigStore['workspaces'];
        }

        return workspace;
    }, [config.workspaces]);

    const workspaceCollections: ConfigStore['collections'] = useMemo(() => {
        const activeWorkspaceName = (
            Object.values(activeWorkspace)?.[0] as ConfigStoreWorkspace
        )?.name;
        return structuredClone(
            Object.fromEntries(
                Object.entries(config.collections).filter(
                    ([collectionFolder]: [string, unknown]) => {
                        return collectionFolder.startsWith(
                            `/${activeWorkspaceName}`
                        );
                    }
                )
            )
        );
    }, [activeWorkspace, config.collections]);

    const toggleExpandCollection = (
        itemFolder: string,
        itemValue: ConfigStoreCollection
    ) => {
        const prevItem = config.collections[itemFolder];
        (itemValue as ConfigStoreCollection).expanded = !prevItem.expanded;
        setConfig({
            ...config,
            collections: { ...config.collections, [itemFolder]: itemValue },
        });
    };

    const createCollection = async (
        workspaceName: string,
        collectionName: string
    ) => {
        const workspaceFolder = `/${workspaceName}`;

        if ((await stat(workspaceFolder)).isDirectory()) {
            const collectionFolder = `${workspaceFolder}/${collectionName}`;
            await mkdir(collectionFolder);
            await writeFile(`${collectionFolder}/.gitkeep`, '', {
                encoding: 'utf8',
                mode: 0o666,
            });
            const collectionsState = structuredClone(config.collections);
            collectionsState[collectionFolder] = {
                ...structuredClone(collectionTemplate),
                name: collectionName,
            };
            setConfig({ ...config, collections: collectionsState });
        }
    };

    const setActiveCollection = (
        itemValue: ConfigStoreCollection,
        itemFolder: string
    ) => {
        (itemValue as ConfigStoreCollection).selected = true;
        setConfig({
            ...config,
            collections: {
                ...Object.fromEntries(
                    Object.entries(config.collections).map(([key, val]) => {
                        (val as ConfigStoreCollection).selected = false;
                        return [key, val];
                    })
                ),
                [itemFolder]: itemValue,
            },
        });
    };

    const activeCollection = useMemo(() => {
        const activeWorkspaceName = (
            Object.values(activeWorkspace)?.[0] as ConfigStoreWorkspace
        )?.name;
        const collection = Object.fromEntries(
            Object.entries(config.collections).filter(([key, item]) => {
                const isInActiveWorkspace = key.startsWith(
                    `/${activeWorkspaceName}`
                );
                return (
                    isInActiveWorkspace &&
                    (item as ConfigStoreCollection).selected
                );
            })
        ) as ConfigStore['collections'];

        return collection;
    }, [activeWorkspace, config.collections]);

    const collectionNotesCallback = useCallback<ConfigStore['notes']>(
        (collection: ConfigStoreCollection): ConfigStore['notes'] => {
            const activeWorkspaceName = (
                Object.values(activeWorkspace)?.[0] as ConfigStoreWorkspace
            )?.name;
            return structuredClone(
                Object.fromEntries(
                    Object.entries(config.notes).filter(
                        ([noteFile]: [string, unknown]) => {
                            return noteFile.startsWith(
                                `/${activeWorkspaceName}/${collection.name}`
                            );
                        }
                    )
                )
            ) as ConfigStore['notes'];
        },
        [activeWorkspace, config.collections, config.notes]
    );

    const removeCollection = async (
        workspaceName: string,
        collectionName: string
    ) => {
        const collectionFolder = `/${workspaceName}/${collectionName}`;

        if ((await stat(collectionFolder)).isDirectory()) {
            const collectionsState = structuredClone(config.collections);
            let notesState = structuredClone(config.notes);
            const notesToUnlink: string[] = [];
            notesState = Object.fromEntries(
                Object.entries(notesState).filter(([key]) => {
                    if (key.startsWith(collectionFolder)) {
                        notesToUnlink.push(key);
                    }

                    return !notesToUnlink.includes(key);
                })
            );

            for (const noteFilePath of notesToUnlink) {
                if ((await stat(noteFilePath)).isFile()) {
                    await unlink(noteFilePath);
                }
            }

            if ((await stat(`${collectionFolder}/.gitkeep`)).isFile()) {
                await unlink(`${collectionFolder}/.gitkeep`);
            }

            if ((await stat(collectionFolder)).isDirectory()) {
                await rmdir(collectionFolder);
            }

            delete collectionsState[collectionFolder];

            setConfig({
                ...config,
                collections: collectionsState,
                notes: notesState,
            });
        }
    };

    const createNote = async (
        workspaceName: string,
        collectionName: string,
        noteName: string
    ) => {
        const collectionFolder = `/${workspaceName}/${collectionName}`;

        if ((await stat(collectionFolder)).isDirectory()) {
            const noteFilePath = `${collectionFolder}/${noteName}.json`;
            await writeFile(
                noteFilePath,
                JSON.stringify(editorEmptyTemplate, null, 2),
                {
                    encoding: 'utf8',
                    mode: 0o666,
                }
            );
            const notesState = structuredClone(config.notes);
            notesState[noteFilePath] = {
                ...structuredClone(noteTemplate),
                name: noteName,
            };
            setConfig({ ...config, notes: notesState });
        }
    };

    const setActiveNote = (noteFile?: string | null) => {
        const notesState = Object.fromEntries(
            Object.entries(config.notes).map(([key, val]) => {
                (val as ConfigStoreNote).open = Boolean(
                    noteFile && key === noteFile
                );
                return [key, val];
            })
        );

        setConfig({ ...config, notes: notesState });
    };

    const activeNote = useMemo((): ConfigStore['notes'] | undefined => {
        const activeWorkspaceName = (
            Object.values(activeWorkspace)?.[0] as ConfigStoreWorkspace
        )?.name;
        const activeCollectionName = (
            Object.values(activeCollection)?.[0] as ConfigStoreCollection
        )?.name;
        const note = Object.fromEntries(
            Object.entries(config.notes).filter(([key, item]) => {
                const folders = key.split('/');
                const isInActiveWorkspace = key.startsWith(
                    `/${activeWorkspaceName}`
                );
                const isInActiveCollection =
                    isInActiveWorkspace &&
                    key.startsWith(
                        `/${activeWorkspaceName}/${activeCollectionName}`
                    );
                const doesCollectionExists = Boolean(
                    Object.keys(config.collections).includes(
                        `/${folders[1]}/${folders[2]}`
                    )
                );
                const isExistingAndOpenNote = (item as ConfigStoreNote)?.open;
                return (
                    isInActiveWorkspace &&
                    isInActiveCollection &&
                    doesCollectionExists &&
                    isExistingAndOpenNote
                );
            })
        ) as ConfigStore['notes'];

        return note;
    }, [activeWorkspace, activeCollection, config.collections, config.notes]);

    // const activeCollection = useMemo(():
    //     | ConfigStore['collections']
    //     | undefined => {
    //     const noteFilePath = Object.keys(activeNote)?.[0];
    //     const pathSplit = noteFilePath?.split('/');
    //     pathSplit?.pop();
    //     const collectionFolderPath = pathSplit?.join('/');
    //
    //     return Object.fromEntries(
    //         Object.entries(config.collections).filter(
    //             ([key]) => collectionFolderPath && key === collectionFolderPath
    //         )
    //     ) as ConfigStore['collections'] | undefined;
    // }, [activeNote]);

    const readNoteFileContent = async (
        noteFilePath: string
    ): Promise<SerializedEditorState> => {
        let content = editorEmptyTemplate;
        if ((await stat(noteFilePath)).isFile()) {
            const fileContent = (await readFile(noteFilePath, {
                encoding: 'utf8',
            })) as string;

            try {
                content = JSON.parse(fileContent);
            } catch (e) {
                // TODO track with analytics (error)
                console.error(e);
            }
        }

        return content;
    };

    const writeNoteFileContent = async (
        noteFilePath: string,
        noteFileContent: string
    ) => {
        if ((await stat(noteFilePath)).isFile()) {
            await writeFile(noteFilePath, noteFileContent, {
                encoding: 'utf8',
                mode: 0o666,
            });
        }
    };

    return {
        createWorkspace,
        moveWorkspace,
        removeWorkspace,
        workspaces,
        activeWorkspace,
        setActiveWorkspace,
        workspaceCollections,
        toggleExpandCollection,
        createCollection,
        removeCollection,
        collectionNotesCallback,
        activeCollection,
        setActiveCollection,
        createNote,
        setActiveNote,
        activeNote,
        readNoteFileContent,
        writeNoteFileContent,
    };
};
