import React, { MouseEvent } from 'react';
import cx from 'classnames';
import styles from './FileTreeFolder.module.scss';
import FileTreeIterator from './FileTreeIterator';
import { ReactComponent as FolderIcon } from '../../icons/folder.svg';
import { ReactComponent as FolderOpenIcon } from '../../icons/folder-open.svg';
import { GlobalContext } from '../../context/global.context';
import { FileSystemItem } from '../../models/FileSystemItem.interface';
import { useAppDispatch } from '../../store/hooks';
import { fileSystemItemOpen } from '../../store/slices/fileSystemSlice';

interface Props {
  item: FileSystemItem;
}

const FileTreeFolder: React.FC<Props> = (props) => {
  const { item } = props;
  const dispatch = useAppDispatch();

  const handleFolderClick = (evt: MouseEvent) => {
    console.log('handleFolderClick', evt, item);
    dispatch(fileSystemItemOpen(item.id));
  };

  return (
    <>
      <button
        className={cx(styles.FileTreeFolder, {
          [styles.folderActive]: item.open,
        })}
        type="button"
        onClick={(evt) => handleFolderClick(evt)}
      >
        {item.open ? <FolderOpenIcon /> : <FolderIcon />} {item.name}
      </button>
      <FileTreeIterator basePath={item.fullPath} />
    </>
  );
};

export default FileTreeFolder;
