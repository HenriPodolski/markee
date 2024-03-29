import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { fileSystemState } from './fileSystem.atoms';
import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';
import { uuid } from '../../lib/uuid';
import fsPromiseSingleton from '../../lib/fsPromiseSingleton';
import config from '../../config';
import { FileSystemTypeEnum } from './fileSystem.enums';

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
      const statResponse = await fsPromise.stat(currentItem);
      let title = '';
      let summary = '';

      if (statResponse.isFile()) {
        const content: string = (await fsPromise.readFile(currentItem, {
          encoding: 'utf8',
        })) as string;
        console.log('content', currentItem, content);
      }

      treeList.push({
        name: dirPathItem,
        id: uuid(),
        title,
        summary,
        fullPath: currentItem,
        basePath: currentDir,
        type: statResponse.isDirectory()
          ? FileSystemTypeEnum.directory
          : FileSystemTypeEnum.file,
        visible: level < 1,
        open: false,
        active: false,
        level,
        modified: new Date(statResponse.mtimeMs),
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
