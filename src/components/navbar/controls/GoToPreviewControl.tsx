import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';
import { ReactComponent as PreviewIcon } from '../../../icons/eye-outline.svg';
import cx from 'classnames';

const GoToPreviewControl: FunctionComponent = () => {
  const onButtonClick = async () => {};

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
