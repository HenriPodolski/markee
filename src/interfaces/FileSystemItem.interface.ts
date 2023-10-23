import { FileSystemTypeEnum } from '../store/fileSystem/fileSystem.enums';

export type FileSystemItem = {
  name: string;
  title?: string;
  summary?: string;
  id: string;
  fullPath: string;
  basePath: string;
  type: FileSystemTypeEnum;
  visible: boolean;
  open: boolean;
  active: boolean;
  level: number;
  modified: string;
  markedForDeletion?: boolean;
};
