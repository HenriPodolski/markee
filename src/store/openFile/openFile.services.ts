import fsPromiseSingleton from '../../lib/fsPromiseSingleton';
import config from '../../config';

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
};
