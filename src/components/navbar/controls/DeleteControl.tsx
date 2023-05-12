import React, { MouseEvent, FunctionComponent } from 'react';
import styles from './Controls.module.scss';
import { useSetRecoilState } from 'recoil';
import { appState } from '../../../store/app/app.atoms';
import { AppState } from '../../../interfaces/AppState.interface';
import { ReactComponent as DeleteSelectIcon } from '../../../icons/delete.svg';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
const DeleteControl: FunctionComponent = () => {
  const { t } = useTranslation('navbar');
  const setApp = useSetRecoilState(appState);
  const onButtonClick = (evt: MouseEvent) => {
    evt.stopPropagation();
    setApp((prev: AppState) => ({
      ...prev,
      showFileDeletionUI: true,
    }));
  };

  return (
    <button
      className={cx(styles.ControlButton, styles.ControlButtonIsIconButton)}
      type="button"
      onClick={onButtonClick}
    >
      <DeleteSelectIcon />
      {t('delete-button-label')}
    </button>
  );
};

export default DeleteControl;
