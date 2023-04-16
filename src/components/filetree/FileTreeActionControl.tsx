import React, { FunctionComponent } from 'react';
import styles from './FileTreeActionControl.module.scss';
import cx from 'classnames';

export type Props = {
  className?: string;
};

const FileTreeActionControl: FunctionComponent<Props> = ({
  className,
}: Props) => {
  return (
    <div className={cx(styles.FileTreeActionControl, className)}>
      FileTreeActionControl
    </div>
  );
};

export default FileTreeActionControl;
