import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';
import fsPromiseSingleton from '../../lib/fsPromiseSingleton';
import config from '../../config';

const fsPromise = fsPromiseSingleton.getInstance(config.fsNamespace);

type UpdateFileSystemByIdParams = {
  id: string;
  previousFileSystemTree: FileSystemItem[];
  updateItem: Partial<FileSystemItem>;
};
export const updateFileSystemItemById = ({
  id,
  previousFileSystemTree,
  updateItem,
}: UpdateFileSystemByIdParams) => {
  const updatedFileSystemTree = [...previousFileSystemTree].map((item) => {
    if (updateItem.active) {
      return {
        ...item,
        active: false,
      };
    }

    return item;
  });
  const index = previousFileSystemTree.findIndex((item) => item.id === id);

  if (index !== undefined) {
    updatedFileSystemTree[index] = {
      ...previousFileSystemTree[index],
      ...updateItem,
    };
  }

  return updatedFileSystemTree;
};

export const createFile = async (filePath: string) => {
  await fsPromise.writeFile(filePath, '', { encoding: 'utf8', mode: 0o777 });
};

export const createDirectory = async (directoryPath: string) => {
  await fsPromise.mkdir(directoryPath);
};
