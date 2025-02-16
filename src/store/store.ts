import { useCallback, useMemo } from "react";
import { initialFsList } from "./fs-store-initial.ts";
import fsPromiseSingleton from "../lib/fs-promise-singleton.ts";
import { createUseStore } from "../lib/create-store.ts";
import {
  collectionTemplate,
  ConfigStore,
  ConfigStoreCollection,
  ConfigStoreWorkspace,
  initialConfig,
  noteTemplate,
  workspaceTemplate,
} from "./config-store-initial.ts";

const fsPromise = fsPromiseSingleton.getInstance("markee");
const { mkdir, writeFile, stat } = fsPromise;

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

  const createWorkspace = async (workspaceName: string) => {
    const workspaceFolder = `/${workspaceName}`;
    await mkdir(workspaceFolder);
    await writeFile(`${workspaceFolder}/.gitkeep`, "", {
      encoding: "utf8",
      mode: 0o666,
    });
    const workspacesState = structuredClone(config.workspaces);
    workspacesState[workspaceFolder] = {
      ...structuredClone(workspaceTemplate),
      name: workspaceName,
    };
    setConfig({ ...config, workspaces: workspacesState });
  };

  const removeWorkspace = async (workspaceName: string) => {
    console.log("Todo implement removeWorkspace", workspaceName);
    // check if empty
    // if not notify user and ask for confirmation (type in collection name for recursive deletion)
    // if yes ask for confirmation and delete the folder and .gitkeep file
  };

  const workspaces: ConfigStore["workspaces"] =
    useMemo((): ConfigStore["workspaces"] => {
      return structuredClone(config.workspaces);
    }, [config.workspaces]);

  const setActiveWorkspace = (
    itemFolder: string,
    itemValue: ConfigStoreWorkspace,
  ) => {
    (itemValue as ConfigStoreWorkspace).selected = true;
    setConfig({
      ...config,
      workspaces: {
        ...Object.fromEntries(
          Object.entries(config.workspaces).map(([key, val]) => {
            (val as ConfigStoreWorkspace).selected = false;
            return [key, val];
          }),
        ),
        [itemFolder]: itemValue,
      },
    });
  };

  const activeWorkspace = useMemo((): ConfigStoreWorkspace => {
    let workspace = (
      Object.values(config.workspaces) as ConfigStoreWorkspace[]
    ).find((item: ConfigStoreWorkspace) => item.selected);

    if (!workspace) {
      const itemValue: ConfigStoreWorkspace = Object.values(
        config.workspaces,
      )[0] as ConfigStoreWorkspace;
      (itemValue as ConfigStoreWorkspace).selected = true;
      workspace = itemValue;
    }

    return workspace!;
  }, [config.workspaces]);

  const workspaceCollections: ConfigStore["collections"] = useMemo(() => {
    return structuredClone(
      Object.fromEntries(
        Object.entries(config.collections).filter(
          ([collectionFolder]: [string, unknown]) => {
            return collectionFolder.startsWith(`/${activeWorkspace.name}`);
          },
        ),
      ),
    );
  }, [activeWorkspace, config.collections]);

  const toggleExpandCollection = (
    itemFolder: string,
    itemValue: ConfigStoreCollection,
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
    collectionName: string,
  ) => {
    const workspaceFolder = `/${workspaceName}`;

    if ((await stat(workspaceFolder)).isDirectory()) {
      const collectionFolder = `${workspaceFolder}/${collectionName}`;
      await mkdir(collectionFolder);
      await writeFile(`${collectionFolder}/.gitkeep`, "", {
        encoding: "utf8",
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

  const collectionNotesCallback = useCallback<ConfigStore["notes"]>(
    (collection: ConfigStoreCollection): ConfigStore["notes"] => {
      return structuredClone(
        Object.fromEntries(
          Object.entries(config.notes).filter(
            ([noteFile]: [string, unknown]) => {
              return noteFile.startsWith(
                `/${activeWorkspace.name}/${collection.name}`,
              );
            },
          ),
        ),
      ) as ConfigStore["notes"];
    },
    [activeWorkspace, config.collection, config.notes],
  );

  const createNote = async (
    workspaceName: string,
    collectionName: string,
    noteName: string,
    noteType: ConfigStoreNoteTypes,
  ) => {
    const collectionFolder = `/${workspaceName}/${collectionName}`;

    if ((await stat(collectionFolder)).isDirectory()) {
      const noteFilePath = `${collectionFolder}/${noteName}.${noteType}`;
      await writeFile(noteFilePath, "", { encoding: "utf8", mode: 0o666 });
      const notesState = structuredClone(config.notes);
      notesState[noteFilePath] = {
        ...structuredClone(noteTemplate),
        name: noteName,
        type: noteType,
      };
      setConfig({ ...config, notes: notesState });
    }
  };

  return {
    createWorkspace,
    removeWorkspace,
    workspaces,
    activeWorkspace,
    setActiveWorkspace,
    workspaceCollections,
    toggleExpandCollection,
    createCollection,
    collectionNotesCallback,
    createNote,
  };
};
