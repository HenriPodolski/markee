import { atom } from 'recoil';
import { FileSystemItem } from '../../models/FileSystemItem.interface';

export const fileSystemState = atom<FileSystemItem[]>({
  key: 'fileSystem',
  default: [],
});
