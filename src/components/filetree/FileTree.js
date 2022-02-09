import React, { useCallback, useContext, useEffect, useState } from 'react';
import FileTreeControls from './controls/FileTreeControls';
import { GlobalContext } from '../../context/global.context';
import FileTreeIterator from './FileTreeIterator';
import styles from './FileTree.module.css';

function FileTree() {
  const [globalContext] = useContext(GlobalContext);
  const [fsPromise] = useState(globalContext.fs.promises);
  const [tree, setTree] = useState([]);

  const walkDirCallback = useCallback(
    () =>
      async (dir, treeList, level = -1) => {
        const dirPath = await fsPromise.readdir(dir ? dir : '/');
        level++;

        for (let i = 0; i < dirPath.length; i++) {
          await (async (index) => {
            const currentItem = `${dir}/${dirPath[index]}`;
            let isDirectory = (await fsPromise.stat(currentItem)).isDirectory();

            if (isDirectory) {
              treeList.push({
                name: dirPath[index],
                fullPath: currentItem,
                type: 'directory',
                open: level < 1,
                level,
              });
              const lastIndex = treeList.length - 1;
              const walkDir = walkDirCallback();
              treeList[lastIndex].content = await walkDir(
                currentItem,
                [],
                level
              );
            } else {
              treeList.push({
                name: dirPath[index],
                fullPath: currentItem,
                type: 'file',
                open: level < 1,
                level,
              });
            }
          })(i);
        }

        return treeList;
      },
    [fsPromise]
  );

  useEffect(() => {
    const prepareTree = async () => {
      const walkDir = walkDirCallback();
      const fileTree = await walkDir('', []);
      setTree(fileTree);
    };

    prepareTree();
  }, [walkDirCallback]);

  return (
    <div>
      <FileTreeControls />
      <div className={styles.filetreeWrap}>
        <FileTreeIterator tree={tree} />
      </div>
    </div>
  );
}

export default FileTree;
