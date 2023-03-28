import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';
import { useRecoilState, useRecoilValue } from 'recoil';
import { appState } from '../../../store/app/app.atoms';
import { fileSystemActiveItemFolderSelector } from '../../../store/fileSystem/fileSystem.selectors';

const NewFolderControl: FunctionComponent = () => {
  const [app, setApp] = useRecoilState(appState);
  const activeFileSystemFolder = useRecoilValue(
    fileSystemActiveItemFolderSelector
  );
  const onButtonClick = () => {
    if (activeFileSystemFolder) {
      setApp({
        ...app,
        createFolder: activeFileSystemFolder,
      });
    }
  };

  return (
    <button
      className={styles.ControlButton}
      type="button"
      onClick={onButtonClick}
    >
      New Folder
    </button>
  );
};

export default NewFolderControl;
