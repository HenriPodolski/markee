import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';

const NewFileControl: FunctionComponent = () => {
  const onButtonClick = () => {
    console.log('Button clicked');
  };

  return (
    <button
      className={styles.ControlButton}
      type="button"
      onClick={onButtonClick}
    >
      New File
    </button>
  );
};

export default NewFileControl;
