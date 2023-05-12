import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';
import { ReactComponent as NotesOverviewIcon } from '../../../icons/book-multiple.svg';
import cx from 'classnames';
import moveToFiletree from '../../../lib/handlers/move-to-filetree';
import { useTranslation } from 'react-i18next';

const GoToFileTreeControl: FunctionComponent = () => {
  const { t } = useTranslation('navbar');
  const onButtonClick = () => {
    moveToFiletree();
  };

  return (
    <button
      className={cx(styles.ControlButton, styles.ControlButtonIsIconButton)}
      type="button"
      onClick={onButtonClick}
    >
      <NotesOverviewIcon />
      {t('notes-overview-button-label')}
    </button>
  );
};

export default GoToFileTreeControl;
