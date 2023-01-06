import { FileSystemItem } from '../../models/FileSystemItem.interface';

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
  const updatedFileSystemTree = [...previousFileSystemTree];
  const index = previousFileSystemTree.findIndex((item) => item.id === id);

  if (index !== undefined) {
    updatedFileSystemTree[index] = {
      ...previousFileSystemTree[index],
      ...updateItem,
    };
  }

  return updatedFileSystemTree;
};
