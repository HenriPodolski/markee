import React, { useState, useRef, useEffect } from 'react';
import Editor from './components/editor/Editor';
import LightningFS from '@isomorphic-git/lightning-fs';
import FileTree from './components/filetree/FileTree';
import styles from './App.module.css';
import { GlobalContext, globalContextDefault } from './context/global.context';
import Preview from './components/preview/Preview';

function App() {
  const [html, setHtml] = useState();
  const [markdown, setMarkdown] = useState();
  const [isSaving, setIsSaving] = useState(false);
  const fsRef = useRef(new LightningFS('markee'));

  const handleSave = async () => {
    const fs = fsRef.current;
    setIsSaving(true);

    await fs.promises.writeFile('/index.md', markdown, { encoding: 'utf8' });
    const fileContent = await fs.promises.readFile('/index.md', {
      encoding: 'utf8',
    });
    setIsSaving(false);
    console.log('fileContent', fileContent);
  };

  const handleEditorChange = ({ markdown, html }) => {
    setMarkdown(markdown);
    setHtml(html);
  };

  const [globalState, setGlobalState] = useState({
    ...globalContextDefault,
    onSave: handleSave,
    isSaving: false,
    html: '',
    fs: fsRef.current,
    editorFileContent: '',
  });

  return (
    <GlobalContext.Provider value={[globalState, setGlobalState]}>
      <main className={styles.App}>
        <FileTree />
        <div className={styles.splitView}>
          <Editor onEditorChange={handleEditorChange} />
          <Preview />
        </div>
      </main>
    </GlobalContext.Provider>
  );
}

export default App;
