import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';
import { useTranslation } from 'react-i18next';

const SettingsControl: FunctionComponent = () => {
  const { t } = useTranslation('navbar');
  const onButtonClick = () => {
    console.log('Button clicked');
  };

  return (
    <button
      className={styles.ControlButton}
      type="button"
      onClick={onButtonClick}
    >
      {t('settings-button-label')}
    </button>
  );
};

export default SettingsControl;
