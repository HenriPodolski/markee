import React, { useContext } from 'react';
import { GlobalContext } from '../../../context/global.context';

function FileTreeControls(props) {
  const [globalContext] = useContext(GlobalContext);
  const { openFilePath, focusedFolder, editorFileMarkdown } = globalContext;

  return (
    <div>
      <button
        type="button"
        onClick={() => globalContext.onNewFile(focusedFolder, openFilePath)}
      >
        New File
      </button>
      <button
        type="button"
        onClick={() => globalContext.onNewFolder(focusedFolder, openFilePath)}
      >
        New Folder
      </button>
      <button
        type="button"
        disabled={globalContext.isSaving}
        onClick={() => globalContext.onSave(openFilePath, editorFileMarkdown)}
      >
        Save
      </button>
    </div>
  );
}

export default FileTreeControls;
