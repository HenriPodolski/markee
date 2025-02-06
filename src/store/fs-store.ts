import fsPromiseSingleton from "../lib/fs-promise-singleton.ts";
import {useSyncExternalStore} from 'react';


const fsPromise = fsPromiseSingleton.getInstance('markee');

// todo find all files
const recursiveWalkDir = async (
    dir: string,
    list: string[]
) => {
    const currentDir = dir ? dir : '/';
    const dirPath = await fsPromise.readdir(currentDir);

    list = await Promise.all(await dirPath.reduce(async (listPromise, dirPathItem: string) => {
            let dirList = await listPromise;
            const currentItem = `${currentDir}${dirPathItem}`;
            const statResponse = await fsPromise.stat(currentItem);


            dirList = [
                ...dirList,
                currentItem
            ];

            if (statResponse.isDirectory()) {
                dirList = dirList.concat(await recursiveWalkDir(`${currentItem}/`, dirList));
            }

            return dirList;
        }, Promise.resolve([] as string[])));

    return list;
};

let fsList = await recursiveWalkDir('/', [] as string[]);

if (!fsList.length) {
    // if no file exist create /Notebook/Notes/Introduction.md
    const { mkdir, writeFile } = fsPromise;
    await mkdir('/Notebook');
    await mkdir('/Notebook/Notes');
    await writeFile('/Notebook/Notes/Introduction.md', 'Hallo Welt', { encoding: 'utf8',  mode: 0o777 });
    fsList = await recursiveWalkDir('/', [] as string[]);
}

export type Listener = () => void;

function createStore<T>({ initialState }: { initialState: T }) {
    let subscribers: Listener[] = [];
    let state = initialState;

    const notifyStateChanged = () => {
        subscribers.forEach((fn) => fn());
    };

    return {
        subscribe(fn: Listener) {
            subscribers.push(fn);
            return () => {
                subscribers = subscribers.filter((listener) => listener !== fn);
            };
        },
        getSnapshot() {
            return state;
        },
        async setState(newState: T) {
            console.log(state, newState);
            state = newState;
            notifyStateChanged();
        },
    };
}

export function createUseFsStore<T>(initialState: T) {
    const store = createStore({ initialState });
    return () => [useSyncExternalStore(store.subscribe, store.getSnapshot), store.setState] as const;
}

const initialFsList = fsList;

export { initialFsList };