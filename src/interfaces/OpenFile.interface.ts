export type OpenFileState = {
  /**
   * content representation in HTML
   */
  content: string;
  fileSystemId: string;
  path: string;
  loading: boolean;
} | null;
