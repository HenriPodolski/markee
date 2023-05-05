export enum Breakpoints {
  xs = 'xs',
  sm = 'sm',
  l = 'l',
}

export enum Views {
  filetree = 'filetree',
  editor = 'editor',
  preview = 'preview',
}

export type AppState = {
  createFile?: string;
  createFolder?: string;
  showFileDeletionUI?: boolean;
  breakpoint?: Breakpoints;
  inView?: Views[];
} | null;
