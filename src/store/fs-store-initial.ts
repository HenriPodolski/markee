import fsPromiseSingleton from '../lib/fs-promise-singleton.ts';

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
        // if no file exist create /Notebook/Notes/Introduction.html
        const { mkdir, writeFile } = fsPromise;
        await mkdir('/Notebook');
        await mkdir('/Notebook/Notes');
        await writeFile('/Notebook/Notes/Introduction.html', 'Hello World', {
            encoding: 'utf8',
            mode: 0o666,
        });
        fsList = await recursiveWalkDir('/', [] as string[]);
    }

    return fsList;
};

export { initialFsList };
