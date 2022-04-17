import React from 'react';
import cx from 'classnames';
import styles from './FileTreeFile.module.scss';
import { ReactComponent as FileIcon } from '../../icons/file-document-outline.svg';
import { ReactComponent as FileEditIcon } from '../../icons/file-document-edit-outline.svg';
import { FileSystemItem } from '../../models/FileSystemItem.interface';
import { useAppSelector } from '../../store/hooks';
import { selectOpenFilePath } from '../../store/slices/openFileSlice';

interface Props {
  item: FileSystemItem;
}

const FileTreeFile: React.FC<Props> = (props) => {
  const { item } = props;
  const openFilePath = useAppSelector(selectOpenFilePath);

  const handleFileClick = () => {
    console.log('handleFileClick', item.fullPath);
  };

  return (
    <>
      <button
        className={cx(styles.FileTreeFile, {
          [styles.fileActive]: openFilePath === item.fullPath,
        })}
        type="button"
        onClick={handleFileClick}
      >
        {openFilePath === item.fullPath ? <FileEditIcon /> : <FileIcon />}{' '}
        {item.name}
      </button>
    </>
  );
};

export default FileTreeFile;
