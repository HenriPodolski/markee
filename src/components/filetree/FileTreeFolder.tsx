import React from 'react';
import cx from 'classnames';
import styles from './FileTreeFolder.module.scss';
import FileTreeIterator from './FileTreeIterator';
import { ReactComponent as FolderIcon } from '../../icons/folder.svg';
import { ReactComponent as FolderOpenIcon } from '../../icons/folder-open.svg';
import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';
import { useRecoilState, useRecoilValue } from 'recoil';
import { fileSystemState } from '../../store/fileSystem/fileSystem.atoms';
import { updateFileSystemItemById } from '../../store/fileSystem/fileSystem.services';
import { fileSystemDirectoryChildrenSelector } from '../../store/fileSystem/fileSystem.selectors';

interface Props {
  item: FileSystemItem;
}

const FileTreeFolder: React.FC<Props> = ({ item }) => {
  const [fileSystem, setFileSystem] = useRecoilState(fileSystemState);
  const directoryChildren = useRecoilValue(
    fileSystemDirectoryChildrenSelector(item.fullPath)
  );

  const handleFolderClick = () => {
    let fileSytemCurrentState = fileSystem;

    fileSytemCurrentState = updateFileSystemItemById({
      id: item.id,
      previousFileSystemTree: fileSytemCurrentState,
      updateItem: {
        open: !item.open,
      },
    });

    directoryChildren.forEach((directoryItem) => {
      fileSytemCurrentState = updateFileSystemItemById({
        id: directoryItem.id,
        previousFileSystemTree: fileSytemCurrentState,
        updateItem: {
          visible: !directoryItem.visible,
        },
      });
    });

    setFileSystem(fileSytemCurrentState);
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
