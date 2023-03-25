import fsPromiseSingleton from '../../lib/fsPromiseSingleton';
import config from '../../config';
import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';
import { SetterOrUpdater } from 'recoil';
import { OpenFileState } from '../../interfaces/OpenFile.interface';
import { FileSystemTypeEnum } from '../fileSystem/fileSystem.enums';

const fsPromise = fsPromiseSingleton.getInstance(config.fsNamespace);

export const loadOpenFileContent = async (path: string): Promise<string> => {
  const content = await fsPromise.readFile(path, {
    encoding: 'utf8',
  });

  return content as string;
};

export const saveOpenFileContent = async (
  filePath: string,
  fileContent: string
) => {
  await fsPromise.writeFile(filePath, fileContent, {
    mode: 0o777,
    encoding: 'utf8',
  });

  return await fsPromise.stat(filePath);
};

export const setOpenFileJoinFileSystem = async (
  item: FileSystemItem,
  setOpenFile: SetterOrUpdater<OpenFileState>,
  fileSystem: FileSystemItem[],
  setFileSystem: SetterOrUpdater<FileSystemItem[]>
) => {
  // Initial state is empty
  const initialOpenFile = {
    content: '',
    fileSystemId: item.id,
    path: item.fullPath,
    loading: true,
  };

  const content = await loadOpenFileContent(item.fullPath);

  // fill content after loading file
  setOpenFile({
    ...initialOpenFile,
    content,
    loading: false,
  });

  setFileSystem(
    fileSystem.map((fileSystemItem: FileSystemItem) => {
      const isDirectoryOpen =
        fileSystemItem.type === FileSystemTypeEnum.directory &&
        fileSystemItem.open;
      const openActiveFile = item.id === fileSystemItem.id;
      return {
        ...fileSystemItem,
        open: isDirectoryOpen || openActiveFile,
      };
    })
  );
};
