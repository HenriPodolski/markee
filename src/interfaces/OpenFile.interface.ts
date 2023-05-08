export type OpenFileState = {
  /**
   * content representation in HTML
   */
  content: string;
  html?: string;
  fileSystemId: string;
  path: string;
  loading: boolean;
  saved: boolean;
} | null;
