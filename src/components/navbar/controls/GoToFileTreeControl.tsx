import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';
import { ReactComponent as NotesOverviewIcon } from '../../../icons/book-multiple.svg';
import cx from 'classnames';
import moveToFiletree from '../../../lib/handlers/move-to-filetree';

const GoToFileTreeControl: FunctionComponent = () => {
  const onButtonClick = () => {
    moveToFiletree();
  };

  return (
    <button
      className={cx(styles.ControlButton, styles.ControlButtonIsIconButton)}
      type="button"
      onClick={onButtonClick}
    >
      <NotesOverviewIcon />
      Files
    </button>
  );
};

export default GoToFileTreeControl;
