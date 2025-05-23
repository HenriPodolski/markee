import fsPromiseSingleton from '../lib/fs-promise-singleton.ts';
import { SerializedEditorState } from 'lexical';

export const editorEmptyTemplate = {
    root: {
        children: [
            {
                children: [
                    {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: '',
                        type: 'text',
                        version: 1,
                    },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1,
            },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
    },
} as unknown as SerializedEditorState;

const welcomeFileConfig = {
    root: {
        children: [
            {
                children: [
                    {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Hallo Welt 🚀',
                        type: 'text',
                        version: 1,
                    },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1,
            },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
    },
} as unknown as SerializedEditorState;

const fsPromise = fsPromiseSingleton.getInstance('markee');
const initialFsList = async () => {
    const recursiveWalkDir = async (dir: string, list: string[]) => {
        const currentDir = dir ? dir : '/';
        const dirPath = await fsPromise.readdir(currentDir);

        list = await Promise.all(
            await dirPath.reduce(
                async (listPromise, dirPathItem: string) => {
                    let dirList = await listPromise;
                    const currentItem = `${currentDir}${dirPathItem}`;
                    const statResponse = await fsPromise.stat(currentItem);

                    if (statResponse.isFile() && dirPathItem.startsWith('.')) {
                        return dirList;
                    }

                    dirList = [...dirList, currentItem];

                    if (statResponse.isDirectory()) {
                        dirList = dirList.concat(
                            await recursiveWalkDir(`${currentItem}/`, dirList)
                        );
                    }

                    return dirList;
                },
                Promise.resolve([] as string[])
            )
        );

        return list;
    };

    let fsList = await recursiveWalkDir('/', [] as string[]);

    if (!fsList.length) {
        // if no file exist create /Notebook/Notes/Introduction.json
        const { mkdir, writeFile } = fsPromise;
        await mkdir('/Notebook');
        await mkdir('/Notebook/Notes');
        await writeFile(
            '/Notebook/Notes/Introduction.json',
            JSON.stringify(welcomeFileConfig, null, 2),
            {
                encoding: 'utf8',
                mode: 0o666,
            }
        );
        fsList = await recursiveWalkDir('/', [] as string[]);
    }

    return fsList;
};

export { initialFsList };
