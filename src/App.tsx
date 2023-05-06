import React, {
  MouseEvent,
  UIEvent,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import Editor from './components/editor/Editor';
import FileTree from './components/filetree/FileTree';
import styles from './App.module.scss';
import Preview from './components/preview/Preview';
import FileTreeNavbar from './components/navbar/FileTreeNavbar';
import { useFileSystemFetch } from './store/fileSystem/useFileSystemFetch';
import { useRecoilState, useRecoilValue } from 'recoil';
import { fileSystemTreeSelector } from './store/fileSystem/fileSystem.selectors';
import { setOpenFileJoinFileSystem } from './store/openFile/openFile.services';
import { fileSystemState } from './store/fileSystem/fileSystem.atoms';
import { openFileState } from './store/openFile/openFile.atoms';
import { FileSystemItem } from './interfaces/FileSystemItem.interface';
import { FileSystemTypeEnum } from './store/fileSystem/fileSystem.enums';
import EditorNavbar from './components/navbar/EditorNavbar';
import PreviewNavbar from './components/navbar/PreviewNavbar';
import { appState } from './store/app/app.atoms';
import { AppState, Breakpoints, Views } from './interfaces/AppState.interface';
import debounce from 'lodash.debounce';

const App = () => {
  useFileSystemFetch();
  const [fileSystem, setFileSystem] = useRecoilState(fileSystemState);
  const [openFile, setOpenFile] = useRecoilState(openFileState);
  const tree = useRecoilValue(fileSystemTreeSelector('/'));
  const [app, setApp] = useRecoilState(appState);
  const splitViewRef = useRef<HTMLElement>(null);

  const setInView = useCallback(
    (breakpoint: Breakpoints = Breakpoints.xs) => {
      if (!splitViewRef.current) {
        setApp((prev: AppState) => ({
          ...prev,
          inView: [],
        }));
        return;
      }
      const targetEl = splitViewRef.current;
      let inView: Views[] = [];

      if (breakpoint === Breakpoints.xs) {
        if (targetEl.scrollLeft === 0) {
          inView = [Views.filetree];
        } else if (
          Math.round(targetEl.scrollLeft / targetEl.offsetWidth) === 1
        ) {
          inView = [Views.editor];
        } else {
          inView = [Views.preview];
        }
      } else if (breakpoint === Breakpoints.sm) {
        if (targetEl.scrollLeft === 0) {
          inView = [Views.filetree, Views.editor];
        } else {
          inView = [Views.editor, Views.preview];
        }
      } else {
        inView = [Views.filetree, Views.editor, Views.preview];
      }

      setApp((prev: AppState) => ({
        ...prev,
        inView,
      }));
    },
    [setApp]
  );

  useEffect(() => {
    const setBreakpointState = () => {
      const computedBreakpoint = window
        .getComputedStyle(document.body, '::after')
        .getPropertyValue('content');
      const breakpoint =
        Breakpoints[
          computedBreakpoint.replace(/"/g, '') as keyof typeof Breakpoints
        ];

      setApp((prev: AppState) => ({
        ...prev,
        breakpoint,
      }));
      setInView(breakpoint);
    };
    const resizeListener = debounce(() => {
      setBreakpointState();
    }, 100);

    window.addEventListener('resize', resizeListener);
    setBreakpointState();

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, [setApp, setInView]);

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
    const splitViewElement = document.getElementById('split-view-section');
    if (splitViewElement) {
      splitViewElement.scrollTo({
        left: (evt.target as HTMLElement).scrollLeft,
        behavior: 'auto',
      });
    }
  };

  const handleSplitViewScroll = (evt: UIEvent) => {
    const controlSectionElement = document.getElementById('control-section');
    const evtTarget = evt.target as HTMLElement;
    if (controlSectionElement) {
      controlSectionElement.scrollTo({
        left: evtTarget.scrollLeft,
        behavior: 'auto',
      });
    }

    setInView(app?.breakpoint);
  };

  return (
    <div onClick={handleAppClick} className={styles.App}>
      <section
        id="control-section"
        onScroll={handleControlSectionScroll}
        className={styles.controlSection}
      >
        <FileTreeNavbar
          id="filetree-navbar"
          className={styles.fileTreeNavbar}
        />
        <EditorNavbar id="editor-navbar" className={styles.editorNavbar} />
        <PreviewNavbar id="preview-navbar" className={styles.previewNavbar} />
      </section>
      <section
        id="split-view-section"
        ref={splitViewRef}
        onScroll={handleSplitViewScroll}
        className={styles.splitView}
      >
        <FileTree id="filetree" className={styles.splitViewChild} />
        <Editor id="editor" className={styles.splitViewChild} />
        <Preview id="preview" className={styles.splitViewChild} />
      </section>
    </div>
  );
};

export default App;
