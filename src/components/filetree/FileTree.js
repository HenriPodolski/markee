import React, {useCallback, useContext, useEffect, useState} from 'react'
import FileTreeControls from "./controls/FileTreeControls";
import {GlobalContext} from "../../context/global.context";
import FileTreeIterator from "./FileTreeIterator";

function FileTree() {
    const globalContext = useContext(GlobalContext);
    const [fsPromise] = useState(globalContext.fs.promises);
    const [tree, setTree] = useState([]);

    const walkDirCallback = useCallback(() => async (dir, treeList) => {
        const dirPath = (await fsPromise.readdir(dir ? dir : '/'));

        for (let i = 0; i < dirPath.length; i++) {
            await (async (index) => {
                const currentItem = `${dir}/${dirPath[index]}`;
                let isDirectory = (await fsPromise.stat(currentItem)).isDirectory();

                if (isDirectory) {
                    treeList.push({
                        name: dirPath[index],
                        fullPath: currentItem,
                        type: 'directory'
                    });
                    const lastIndex = treeList.length - 1;
                    const walkDir = walkDirCallback();
                    treeList[lastIndex].content = await walkDir(currentItem, []);
                } else {
                    treeList.push({
                        name: dirPath[index],
                        fullPath: currentItem,
                        type: 'file'
                    });
                }
            })(i);
        }

        return treeList;
    }, [fsPromise]);

    useEffect(() => {
        const prepareTree = async () => {
            const walkDir = walkDirCallback();
            const fileTree = await walkDir('', []);
            console.log('prepareTree', JSON.stringify(fileTree, null, 4));
            setTree(fileTree);
        }

        prepareTree();
    }, [walkDirCallback]);

    return (
        <div>
            <FileTreeControls />
            <FileTreeIterator tree={tree} />
        </div>
    );
}

export default FileTree