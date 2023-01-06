import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { fileSystemState } from './fileSystem.atoms';
import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';
import { uuid } from '../../lib/uuid';
import fsPromiseSingleton from '../../lib/fsPromiseSingleton';
import config from '../../config';

const fsPromise = fsPromiseSingleton.getInstance(config.fsNamespace);
const recursiveWalkDir = async (
  dir: string,
  treeList: FileSystemItem[],
  level = -1
) => {
  const currentDir = dir ? dir : '/';
  const dirPath = await fsPromise.readdir(currentDir);
  level++;

  await Promise.all(
    dirPath.map(async (dirPathItem: string) => {
      const currentItem = `${currentDir}${dirPathItem}`;
      let statResponse = await fsPromise.stat(currentItem);

      treeList.push({
        name: dirPathItem,
        id: uuid(),
        fullPath: currentItem,
        basePath: currentDir,
        type: statResponse.isDirectory() ? 'directory' : 'file',
        visible: level < 1,
        open: false,
        level,
      });

      if (statResponse.isDirectory()) {
        await recursiveWalkDir(`${currentItem}/`, treeList, level);
      }
    })
  );

  return treeList;
};

const walkDirCallback = async () => {
  const treelist: FileSystemItem[] = [];
  await recursiveWalkDir('', treelist);
  return treelist;
};

export const useFileSystemFetch = () => {
  const [fileSystem, setFileSystem] = useRecoilState(fileSystemState);

  useEffect(() => {
    async function fetchData() {
      const data = await walkDirCallback();
      setFileSystem(data);
    }

    fetchData();
  }, [setFileSystem]);

  return fileSystem;
};
