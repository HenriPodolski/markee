import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';
import { useRecoilValue } from 'recoil';
import { openFileState } from '../../../store/openFile/openFile.atoms';
import { saveOpenFileContent } from '../../../store/openFile/openFile.services';
import { useTranslation } from 'react-i18next';

const SyncFilesControl: FunctionComponent = () => {
  const { t } = useTranslation('navbar');
  const openFile = useRecoilValue(openFileState);

  const onButtonClick = async () => {
    // TODO add sync to GIT repository here
    if (openFile?.path && openFile.content && !openFile.loading) {
      await saveOpenFileContent(openFile?.path, openFile?.content);
    }
  };

  return (
    <button
      className={styles.ControlButton}
      type="button"
      onClick={onButtonClick}
    >
      {t('sync-button-label')}
    </button>
  );
};

export default SyncFilesControl;
