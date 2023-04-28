import React, { MouseEvent, FunctionComponent } from 'react';
import styles from './Controls.module.scss';
import { useSetRecoilState } from 'recoil';
import { appState } from '../../../store/app/app.atoms';
import { AppState } from '../../../interfaces/AppState.interface';

const DeleteControl: FunctionComponent = () => {
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
      className={styles.ControlButton}
      type="button"
      onClick={onButtonClick}
    >
      Delete files/directories
    </button>
  );
};

export default DeleteControl;
