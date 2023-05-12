import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';
import { useRecoilState, useRecoilValue } from 'recoil';
import { appState } from '../../../store/app/app.atoms';
import { fileSystemActiveItemDirectorySelector } from '../../../store/fileSystem/fileSystem.selectors';
import { ReactComponent as NewNoteIcon } from '../../../icons/note-plus.svg';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

const NewFileControl: FunctionComponent = () => {
  const { t } = useTranslation('navbar');
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
      <NewNoteIcon />
      {t('new-note-button-label')}
    </button>
  );
};

export default NewFileControl;
