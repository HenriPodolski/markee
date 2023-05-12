import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';
import { useRecoilState, useRecoilValue } from 'recoil';
import { appState } from '../../../store/app/app.atoms';
import { fileSystemActiveItemDirectorySelector } from '../../../store/fileSystem/fileSystem.selectors';
import { ReactComponent as NewNoteBookIcon } from '../../../icons/book-plus.svg';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
const NewFolderControl: FunctionComponent = () => {
  const { t } = useTranslation('navbar');
  const [app, setApp] = useRecoilState(appState);
  const activeFileSystemFolder = useRecoilValue(
    fileSystemActiveItemDirectorySelector
  );
  const onButtonClick = () => {
    setApp({
      ...app,
      createFolder: activeFileSystemFolder ?? '/',
    });
  };

  return (
    <button
      className={cx(styles.ControlButton, styles.ControlButtonIsIconButton)}
      type="button"
      onClick={onButtonClick}
    >
      <NewNoteBookIcon />
      {t('new-collection-button-label')}
    </button>
  );
};

export default NewFolderControl;
