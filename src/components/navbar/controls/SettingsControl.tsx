import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';

const SettingsControl: FunctionComponent = () => {
  const onButtonClick = () => {
    console.log('Button clicked');
  };

  return (
    <button
      className={styles.ControlButton}
      type="button"
      onClick={onButtonClick}
    >
      Settings
    </button>
  );
};

export default SettingsControl;
