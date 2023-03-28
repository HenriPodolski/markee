import React, { FunctionComponent } from 'react';
import styles from './FileTreeIterator.module.scss';
import cx from 'classnames';
import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';
import { useRecoilValue } from 'recoil';
import { fileSystemTreeSelector } from '../../store/fileSystem/fileSystem.selectors';
import FileTreeFolder from './FileTreeFolder';
import FileTreeFile from './FileTreeFile';
import {
  createFileSelector,
  createFolderSelector,
} from '../../store/app/app.selectors';
import { FileSystemTypeEnum } from '../../store/fileSystem/fileSystem.enums';

interface Props {
  basePath?: string;
}

const FileTreeIterator: FunctionComponent<Props> = ({ basePath = '/' }) => {
  const tree = useRecoilValue(fileSystemTreeSelector(basePath));
  const createFile = useRecoilValue(createFileSelector);
  const createFolder = useRecoilValue(createFolderSelector);

  return (
    <>
      {Boolean(tree && tree.length) && (
        <ol className={styles.FileTreeIterator}>
          {createFolder && createFolder === basePath && (
            <li className={cx(styles.listItem)}>Create Folder Form Input</li>
          )}
          {tree.map((item: FileSystemItem, i: number) => {
            return (
              <li
                className={cx(styles.listItem, {
                  [styles.listItemCollapsed]: !item.visible,
                })}
                key={`${item.name}-${i}`}
              >
                {item.type === FileSystemTypeEnum.directory && (
                  <FileTreeFolder item={item} />
                )}
              </li>
            );
          })}
          {createFile && createFile === basePath && (
            <li className={cx(styles.listItem)}>Create File Form Input</li>
          )}
          {tree.map((item: FileSystemItem, i: number) => {
            return (
              <li
                className={cx(styles.listItem, {
                  [styles.listItemCollapsed]: !item.visible,
                })}
                key={`${item.name}-${i}`}
              >
                {item.type === FileSystemTypeEnum.file && (
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
