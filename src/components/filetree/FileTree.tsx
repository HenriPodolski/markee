import React, { FunctionComponent } from 'react';
import FileTreeIterator from './FileTreeIterator';
import styles from './FileTree.module.scss';
import cx from 'classnames';

export type Props = {
  className: string;
};

const FileTree: FunctionComponent<Props> = ({ className }: Props) => {
  return (
    <div className={cx(styles.FileTree, className)}>
      <div className={styles.filetreeWrap}>
        <FileTreeIterator />
      </div>
    </div>
  );
};

export default FileTree;
