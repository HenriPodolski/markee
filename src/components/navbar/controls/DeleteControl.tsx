import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';
import { useSetRecoilState } from 'recoil';
import { appState } from '../../../store/app/app.atoms';

const DeleteControl: FunctionComponent = () => {
  const setApp = useSetRecoilState(appState);
  const onButtonClick = () => {
    console.log('DeleteControl Button clicked');
    setApp((prev) => ({
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
