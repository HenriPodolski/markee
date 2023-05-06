import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';
import fsPromiseSingleton from '../../lib/fsPromiseSingleton';
import config from '../../config';

const fsPromise = fsPromiseSingleton.getInstance(config.fsNamespace);

type UpdateFileSystemByIdParams = {
  id: string;
  previousFileSystemTree: FileSystemItem[];
  updateItem: Partial<FileSystemItem>;
};

export const getChangesFromFileSystemItemById = ({
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

export const applyChangesToFileSystemItems = ({
  itemsToUpdateIds,
  previousFileSystemTree,
  updateObject,
}: {
  itemsToUpdateIds: FileSystemItem['id'][];
  previousFileSystemTree: FileSystemItem[];
  updateObject: Partial<FileSystemItem>;
}) => {
  if (updateObject.id) {
    throw new Error('Cannot update id');
  }

  let updatedList = JSON.parse(JSON.stringify(previousFileSystemTree));
  itemsToUpdateIds.forEach((itemsToUpdateId: FileSystemItem['id']) => {
    updatedList = getChangesFromFileSystemItemById({
      id: itemsToUpdateId,
      previousFileSystemTree: updatedList,
      updateItem: {
        ...updateObject,
      },
    });
  });

  return updatedList;
};

export const createFile = async (filePath: string) => {
  await fsPromise.writeFile(filePath, '', { encoding: 'utf8', mode: 0o777 });
};

export const createDirectory = async (directoryPath: string) => {
  await fsPromise.mkdir(directoryPath);
};

export const deleteFileSystemItem = async (path: string) => {
  const statResponse = await fsPromise.stat(path);

  if (statResponse.isDirectory()) {
    await fsPromise.rmdir(path);
  } else {
    await fsPromise.unlink(path);
  }
};
