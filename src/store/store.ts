import {useMemo} from "react";
import {createUseFsStore, initialFsList} from "./fs-store.ts";
import fsPromiseSingleton from "../lib/fs-promise-singleton.ts";
const fsPromise = fsPromiseSingleton.getInstance('markee');

const { mkdir } = fsPromise;


export const useFsStore = createUseFsStore<string[]>([...initialFsList]);

export const useWorkspaces = () => {
    const [fs, setFs] = useFsStore();

    const workspaces = useMemo(() =>  {
        return fs.filter(item => item.split('/').length === 2).map(item => item.split('/')[1]);
    }, [fs]);

    const createWorkspace = async (workspaceName: string) => {
        await mkdir(workspaceName);
        setFs([...fs, workspaceName]);
    }

    return { createWorkspace, workspaces };
}