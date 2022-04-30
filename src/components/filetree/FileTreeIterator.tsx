import React from 'react';
import styles from './FileTreeIterator.module.scss';
import cx from 'classnames';
import FileTreeFolder from './FileTreeFolder';
import { selectFileSystemByBasePath } from '../../store/slices/fileSystemSlice';
import FileTreeFile from './FileTreeFile';
import { useAppSelector } from '../../store/hooks';
import { FileSystemItem } from '../../models/FileSystemItem.interface';

interface Props {
  basePath?: string;
}

const FileTreeIterator: React.FC<Props> = (props) => {
  const tree = useAppSelector((state) =>
    selectFileSystemByBasePath(state, props.basePath ? props.basePath : '/')
  );

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
