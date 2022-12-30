import React from 'react';
import Editor from './components/editor/Editor';
import FileTree from './components/filetree/FileTree';
import styles from './App.module.scss';
// import { GlobalContext, globalContextDefault } from './context/global.context';
import Preview from './components/preview/Preview';
import Navbar from './components/navbar/Navbar';
import { useFileSystemFetch } from './store/fileSystem/useFileSystemFetch';

const App = () => {
  useFileSystemFetch();
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
  return (
    <div className={styles.App}>
      <section className={styles.controlSection}>
        <Navbar />
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
