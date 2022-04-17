export interface FileSystemItem {
  name: string;
  id: string;
  fullPath: string;
  basePath: string;
  type: 'directory' | 'file';
  visible: boolean;
  open: boolean;
  level: number;
}
