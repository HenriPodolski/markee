import React, { FunctionComponent } from 'react';
import FileTreeIterator from './FileTreeIterator';
import styles from './FileTree.module.scss';
import cx from 'classnames';
import FileTreeActionControl from './FileTreeActionControl';
import { useRecoilValue } from 'recoil';
import { appState } from '../../store/app/app.atoms';

export type Props = {
  className: string;
  id?: string;
};

const FileTree: FunctionComponent<Props> = ({ id, className }: Props) => {
  const app = useRecoilValue(appState);
  return (
    <div id={id} data-file-select-ui className={cx(styles.FileTree, className)}>
      {app?.showFileDeletionUI && <FileTreeActionControl />}
      <div className={styles.filetreeWrap}>
        <FileTreeIterator />
      </div>
    </div>
  );
};

export default FileTree;
