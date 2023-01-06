import { atom } from 'recoil';
import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';

export const fileSystemState = atom<FileSystemItem[]>({
  key: 'fileSystem',
  default: [],
});
