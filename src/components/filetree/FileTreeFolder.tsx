import React from 'react';
import cx from 'classnames';
import styles from './FileTreeFolder.module.scss';
import FileTreeIterator from './FileTreeIterator';
import { ReactComponent as FolderIcon } from '../../icons/folder-outline.svg';
import { ReactComponent as FolderOpenIcon } from '../../icons/folder-open-outline.svg';
import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';
import { useRecoilState, useRecoilValue } from 'recoil';
import { fileSystemState } from '../../store/fileSystem/fileSystem.atoms';
import { getChangesFromFileSystemItemById } from '../../store/fileSystem/fileSystem.services';
import { fileSystemDirectoryChildrenSelector } from '../../store/fileSystem/fileSystem.selectors';
import FileTreeCheckbox from './FileTreeCheckbox';
import { appState } from '../../store/app/app.atoms';

interface Props {
  item: FileSystemItem;
}

const FileTreeFolder: React.FC<Props> = ({ item }) => {
  const [fileSystem, setFileSystem] = useRecoilState(fileSystemState);
  const directoryChildren = useRecoilValue(
    fileSystemDirectoryChildrenSelector(item.fullPath)
  );
  const app = useRecoilValue(appState);

  const handleFolderClick = () => {
    let fileSytemCurrentState = fileSystem;

    fileSytemCurrentState = getChangesFromFileSystemItemById({
      id: item.id,
      previousFileSystemTree: fileSytemCurrentState,
      updateItem: {
        open: !item.open,
        active: true,
      },
    });

    directoryChildren.forEach((directoryItem) => {
      fileSytemCurrentState = getChangesFromFileSystemItemById({
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
      <div
        className={cx(styles.FileTreeFolder, {
          [styles.SelectionActive]: app?.showFileDeletionUI,
        })}
      >
        <button
          className={cx(styles.Button, {
            [styles.folderActive]: item.open,
          })}
          type="button"
          onClick={handleFolderClick}
        >
          {item.open ? <FolderOpenIcon /> : <FolderIcon />} {item.name}
        </button>
        {app?.showFileDeletionUI && (
          <FileTreeCheckbox id={item.id} fileName={item.name} />
        )}
      </div>
      <FileTreeIterator basePath={item.fullPath} />
    </>
  );
};

export default FileTreeFolder;
