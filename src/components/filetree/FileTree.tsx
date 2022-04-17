import React from 'react';
import FileTreeControls from './controls/FileTreeControls';
import FileTreeIterator from './FileTreeIterator';
import styles from './FileTree.module.scss';

function FileTree() {
  return (
    <div>
      <FileTreeControls />
      <div className={styles.filetreeWrap}>
        <FileTreeIterator />
      </div>
    </div>
  );
}

export default FileTree;
