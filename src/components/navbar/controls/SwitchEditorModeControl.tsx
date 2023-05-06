import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';

const SwitchEditorModeControl: FunctionComponent = () => {
  const onButtonClick = () => {
    console.log('SwitchEditorModeControl Button clicked');
  };

  return (
    <button
      className={styles.ControlButton}
      type="button"
      onClick={onButtonClick}
    >
      Switch Editor Mode
    </button>
  );
};

export default SwitchEditorModeControl;
