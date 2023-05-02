import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';
import { useRecoilState, useRecoilValue } from 'recoil';
import { appState } from '../../../store/app/app.atoms';
import { fileSystemActiveItemDirectorySelector } from '../../../store/fileSystem/fileSystem.selectors';
import { ReactComponent as NewFileIcon } from '../../../icons/file-document-plus-outline.svg';
import cx from 'classnames';

const NewFileControl: FunctionComponent = () => {
  const [app, setApp] = useRecoilState(appState);
  const activeFileSystemFolder = useRecoilValue(
    fileSystemActiveItemDirectorySelector
  );
  const onButtonClick = () => {
    setApp({
      ...app,
      createFile: activeFileSystemFolder ?? '/',
    });
  };

  return (
    <button
      className={cx(styles.ControlButton, styles.ControlButtonIsIconButton)}
      type="button"
      onClick={onButtonClick}
    >
      <NewFileIcon />
      New Note
    </button>
  );
};

export default NewFileControl;
