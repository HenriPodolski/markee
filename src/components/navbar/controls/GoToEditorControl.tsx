import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';
import { ReactComponent as EditorIcon } from '../../../icons/file-document-edit-outline.svg';
import cx from 'classnames';

const GoToEditorControl: FunctionComponent = () => {
  const onButtonClick = async () => {};

  return (
    <button
      className={cx(styles.ControlButton, styles.ControlButtonIsIconButton)}
      type="button"
      onClick={onButtonClick}
    >
      <EditorIcon />
      Editor
    </button>
  );
};

export default GoToEditorControl;
