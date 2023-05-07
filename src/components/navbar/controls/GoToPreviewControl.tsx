import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';
import { ReactComponent as PreviewIcon } from '../../../icons/eye.svg';
import cx from 'classnames';

const GoToPreviewControl: FunctionComponent = () => {
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
      Preview
    </button>
  );
};

export default GoToPreviewControl;
