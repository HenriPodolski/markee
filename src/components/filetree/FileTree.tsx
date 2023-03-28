import React, { FunctionComponent, useMemo } from 'react';
import FileTreeIterator from './FileTreeIterator';
import styles from './FileTree.module.scss';
import cx from 'classnames';
import { useRecoilValue } from 'recoil';
import {
  createFileSelector,
  createFolderSelector,
} from '../../store/app/app.selectors';

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
