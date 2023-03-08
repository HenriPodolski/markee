import React from 'react';
import styles from './FileTreeIterator.module.scss';
import cx from 'classnames';
import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';
import { useRecoilValue } from 'recoil';
import { fileSystemTreeSelector } from '../../store/fileSystem/fileSystem.selectors';
import FileTreeFolder from './FileTreeFolder';
import FileTreeFile from './FileTreeFile';

interface Props {
  basePath?: string;
}

const FileTreeIterator: React.FC<Props> = ({ basePath }) => {
  const tree = useRecoilValue(fileSystemTreeSelector(basePath ?? '/'));

  return (
    <>
      {Boolean(tree && tree.length) && (
        <ol className={styles.FileTreeIterator}>
          {tree.map((item: FileSystemItem, i: number) => {
            return (
              <li
                className={cx(styles.listItem, {
                  [styles.listItemCollapsed]: !item.visible,
                })}
                key={`${item.name}-${i}`}
              >
                {item.type === 'directory' ? (
                  <FileTreeFolder item={item} />
                ) : (
                  <FileTreeFile item={item} />
                )}
              </li>
            );
          })}
        </ol>
      )}
    </>
  );
};

export default FileTreeIterator;
