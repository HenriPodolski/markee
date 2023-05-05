import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';
import { ReactComponent as FileTreeIcon } from '../../../icons/file-tree-outline.svg';
import cx from 'classnames';

const GoToFileTreeControl: FunctionComponent = () => {
  const onButtonClick = async () => {
    const filetreeElement = document.getElementById('filetree');
    const splitViewElement = document.getElementById('split-view-section');
    if (filetreeElement && splitViewElement) {
      splitViewElement.scrollTo({
        left: filetreeElement.offsetLeft,
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
      <FileTreeIcon />
      Files
    </button>
  );
};

export default GoToFileTreeControl;
