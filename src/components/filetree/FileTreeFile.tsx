import React from 'react';
import cx from 'classnames';
import styles from './FileTreeFile.module.scss';
import { ReactComponent as FileIcon } from '../../icons/file-document-outline.svg';
import { ReactComponent as FileEditIcon } from '../../icons/file-document-edit-outline.svg';
import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';
import { useRecoilState } from 'recoil';
import {
  loadOpenFileContent,
  setOpenFileJoinFileSystem,
} from '../../store/openFile/openFile.services';
import { openFileState } from '../../store/openFile/openFile.atoms';
import { fileSystemState } from '../../store/fileSystem/fileSystem.atoms';

interface Props {
  item: FileSystemItem;
}

const FileTreeFile: React.FC<Props> = (props) => {
  const { item } = props;
  const [fileSystem, setFileSystem] = useRecoilState(fileSystemState);
  const [openFile, setOpenFile] = useRecoilState(openFileState);

  const handleFileClick = async () => {
    if (openFile?.path === item.fullPath) {
      return;
    }

    await setOpenFileJoinFileSystem(
      item,
      setOpenFile,
      fileSystem,
      setFileSystem
    );
  };

  return (
    <>
      <button
        className={cx(styles.FileTreeFile, {
          [styles.fileActive]: openFile?.path === item.fullPath,
        })}
        type="button"
        onClick={handleFileClick}
      >
        {openFile?.path === item.fullPath ? <FileEditIcon /> : <FileIcon />}{' '}
        {item.name}
      </button>
    </>
  );
};

export default FileTreeFile;
