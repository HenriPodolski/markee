import React from 'react';
import cx from 'classnames';
import styles from './FileTreeFolder.module.scss';
import FileTreeIterator from './FileTreeIterator';
import { ReactComponent as FolderIcon } from '../../icons/folder.svg';
import { ReactComponent as FolderOpenIcon } from '../../icons/folder-open.svg';
import { FileSystemItem } from '../../models/FileSystemItem.interface';
import { useAppDispatch } from '../../store/hooks';
import { fileSystemFolderToggle } from '../../store/slices/fileSystemSlice';

interface Props {
  item: FileSystemItem;
}

const FileTreeFolder: React.FC<Props> = ({ item }) => {
  const dispatch = useAppDispatch();

  const handleFolderClick = () => {
    dispatch(fileSystemFolderToggle(item.id));
  };

  return (
    <>
      <button
        className={cx(styles.FileTreeFolder, {
          [styles.folderActive]: item.open,
        })}
        type="button"
        onClick={handleFolderClick}
      >
        {item.open ? <FolderOpenIcon /> : <FolderIcon />} {item.name}
      </button>
      <FileTreeIterator basePath={item.fullPath} />
    </>
  );
};

export default FileTreeFolder;
