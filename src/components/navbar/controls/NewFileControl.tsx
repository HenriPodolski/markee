import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';
import { useRecoilState, useRecoilValue } from 'recoil';
import { appState } from '../../../store/app/app.atoms';
import { fileSystemActiveItemDirectorySelector } from '../../../store/fileSystem/fileSystem.selectors';

const NewFileControl: FunctionComponent = () => {
  const [app, setApp] = useRecoilState(appState);
  const activeFileSystemFolder = useRecoilValue(
    fileSystemActiveItemDirectorySelector
  );
  const onButtonClick = () => {
    if (activeFileSystemFolder) {
      setApp({
        ...app,
        createFile: activeFileSystemFolder,
      });
    }
  };

  return (
    <button
      className={styles.ControlButton}
      type="button"
      onClick={onButtonClick}
    >
      New File
    </button>
  );
};

export default NewFileControl;
