import React, { MouseEvent, useEffect } from 'react';
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

  // const [setIsSaving] = useState(false);
  // const fsRef = useRef(new LightningFS('markee'));
  //
  // const handleSave = async (filePath, fileContent) => {
  //   const fs = fsRef.current;
  //   setIsSaving(true);
  //
  //   console.log('filePath', filePath, fileContent);
  //
  //   // get current open file path
  //   // get the markdown from editor instance
  //   // save
  //   await fs.promises.writeFile(filePath, fileContent, { encoding: 'utf8' });
  //   setIsSaving(false);
  // };
  //
  // const handleCreateNewFile = async (filePath, fileContent = '') => {
  //   console.log('createNewFile', filePath, fileContent);
  //   const fs = fsRef.current;
  //
  //   await fs.promises.writeFile(filePath, fileContent, {
  //     encoding: 'utf8',
  //   });
  // };
  //
  // const handleNewFile = async (focusedFolder, openFilePath) => {
  //   let createPath = '';
  //
  //   if (focusedFolder) {
  //     createPath = focusedFolder;
  //   } else if (openFilePath) {
  //     const filepathSplit = openFilePath.split('/');
  //     filepathSplit.pop();
  //     createPath = filepathSplit.join('/');
  //   }
  //
  //   setGlobalState({
  //     ...globalState,
  //     newFileCreateRequest: {
  //       createPath,
  //       level: createPath.split('/').filter((pathPart) => Boolean(pathPart))
  //         .length,
  //     },
  //   });
  // };
  //
  // const handleNewFolder = (focusedFolder, openFilePath) => {
  //   // case undefined for both -> create on the top level
  //   console.log('handleNewFolder', focusedFolder, openFilePath);
  // };
  //
  // const handleEditorChange = ({ markdown, html, content }) => {
  //   setGlobalState({
  //     ...globalState,
  //     editorFileMarkdown: markdown,
  //     editorFileHTML: html,
  //     editorFileContent: content,
  //   });
  // };
  //
  // const [globalState, setGlobalState] = useState({
  //   ...globalContextDefault,
  //   onCreateNewFile: handleCreateNewFile,
  //   onSave: handleSave,
  //   onNewFile: handleNewFile,
  //   onNewFolder: handleNewFolder,
  //   newFileCreateRequest: null,
  //   isSaving: false,
  //   html: '',
  //   fs: fsRef.current,
  //   editorFileContent: '',
  //   updateFileTree: Date.now(),
  // });
  //

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

  return (
    <div onClick={handleAppClick} className={styles.App}>
      <section className={styles.controlSection}>
        <FileTreeNavbar className={styles.fileTreeNavbar} />
        <EditorNavbar className={styles.editorNavbar} />
        <PreviewNavbar className={styles.previewNavbar} />
      </section>
      <section className={styles.splitView}>
        <FileTree className={styles.splitViewChild} />
        <Editor className={styles.splitViewChild} />
        <Preview className={styles.splitViewChild} />
      </section>
    </div>
  );
};

export default App;
