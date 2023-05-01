import React, { MouseEvent, UIEvent, useEffect, useRef } from 'react';
import Editor from './components/editor/Editor';
import FileTree from './components/filetree/FileTree';
import styles from './App.module.scss';
import Preview from './components/preview/Preview';
import FileTreeNavbar from './components/navbar/FileTreeNavbar';
import { useFileSystemFetch } from './store/fileSystem/useFileSystemFetch';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { fileSystemTreeSelector } from './store/fileSystem/fileSystem.selectors';
import { setOpenFileJoinFileSystem } from './store/openFile/openFile.services';
import { fileSystemState } from './store/fileSystem/fileSystem.atoms';
import { openFileState } from './store/openFile/openFile.atoms';
import { FileSystemItem } from './interfaces/FileSystemItem.interface';
import { FileSystemTypeEnum } from './store/fileSystem/fileSystem.enums';
import EditorNavbar from './components/navbar/EditorNavbar';
import PreviewNavbar from './components/navbar/PreviewNavbar';
import { appState } from './store/app/app.atoms';
import { AppState } from './interfaces/AppState.interface';

const App = () => {
  useFileSystemFetch();
  const [fileSystem, setFileSystem] = useRecoilState(fileSystemState);
  const [openFile, setOpenFile] = useRecoilState(openFileState);
  const tree = useRecoilValue(fileSystemTreeSelector('/'));
  const setApp = useSetRecoilState(appState);
  const controlSectionRef = useRef<HTMLElement>(null);
  const splitViewRef = useRef<HTMLElement>(null);
  /**
   * used to prepare editor default state
   */
  useEffect(() => {
    if (openFile) {
      return;
    }
    const prepareEditorDefaultState = async () => {
      const item = tree.find(
        (fileSystemItem: FileSystemItem) =>
          fileSystemItem.type === FileSystemTypeEnum.file
      );

      if (item) {
        await setOpenFileJoinFileSystem(
          item,
          setOpenFile,
          fileSystem,
          setFileSystem
        );
      }
    };

    prepareEditorDefaultState();
  }, [tree, fileSystem, setFileSystem, openFile, setOpenFile]);

  /**
   * used to reset UI elements and/or state
   * when the user does something else
   * @param evt
   */
  const handleAppClick = (evt: MouseEvent) => {
    const clickedElement: HTMLElement = evt.target as HTMLElement;
    const fileSelectUIParent = document.querySelector('[data-file-select-ui]');

    if (!fileSelectUIParent?.contains(clickedElement)) {
      setApp((prev: AppState) => ({
        ...prev,
        showFileDeletionUI: false,
      }));
    }
  };

  const handleControlSectionScroll = (evt: UIEvent) => {
    if (splitViewRef.current) {
      splitViewRef.current.scrollTo({
        left: (evt.target as HTMLElement).scrollLeft,
        behavior: 'auto',
      });
    }
  };

  const handleSplitViewScroll = (evt: UIEvent) => {
    if (controlSectionRef.current) {
      controlSectionRef.current.scrollTo({
        left: (evt.target as HTMLElement).scrollLeft,
        behavior: 'auto',
      });
    }
  };

  return (
    <div onClick={handleAppClick} className={styles.App}>
      <section
        ref={controlSectionRef}
        onScroll={handleControlSectionScroll}
        className={styles.controlSection}
      >
        <FileTreeNavbar className={styles.fileTreeNavbar} />
        <EditorNavbar className={styles.editorNavbar} />
        <PreviewNavbar className={styles.previewNavbar} />
      </section>
      <section
        ref={splitViewRef}
        onScroll={handleSplitViewScroll}
        className={styles.splitView}
      >
        <FileTree className={styles.splitViewChild} />
        <Editor className={styles.splitViewChild} />
        <Preview className={styles.splitViewChild} />
      </section>
    </div>
  );
};

export default App;
