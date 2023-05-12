import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';
import { ReactComponent as PreviewIcon } from '../../../icons/eye.svg';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

const GoToPreviewControl: FunctionComponent = () => {
  const { t } = useTranslation('navbar');
  const onButtonClick = async () => {
    const previewElement = document.getElementById('preview');
    const splitViewElement = document.getElementById('split-view-section');
    if (previewElement && splitViewElement) {
      splitViewElement.scrollTo({
        left: previewElement.offsetLeft,
        behavior: 'auto',
      });
    }
  };

  return (
    <button
      className={cx(styles.ControlButton, styles.ControlButtonIsIconButton)}
      type="button"
      onClick={onButtonClick}
    >
      <PreviewIcon />
      {t('preview-button-label')}
    </button>
  );
};

export default GoToPreviewControl;
