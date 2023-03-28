import { FileSystemTypeEnum } from '../store/fileSystem/fileSystem.enums';

export type FileSystemItem = {
  name: string;
  id: string;
  fullPath: string;
  basePath: string;
  type: FileSystemTypeEnum;
  visible: boolean;
  open: boolean;
  active: boolean;
  level: number;
  modified: Date;
};
