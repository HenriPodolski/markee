import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';

const NewFolderControl: FunctionComponent = () => {
  const onButtonClick = () => {
    console.log('Button clicked');
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
