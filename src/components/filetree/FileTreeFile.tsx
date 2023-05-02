import React from 'react';
import cx from 'classnames';
import styles from './FileTreeFile.module.scss';
import { ReactComponent as FileIcon } from '../../icons/file-document-outline.svg';
import { ReactComponent as FileEditIcon } from '../../icons/file-document-edit-outline.svg';
import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';
import { useRecoilState, useRecoilValue } from 'recoil';
import { setOpenFileJoinFileSystem } from '../../store/openFile/openFile.services';
import { openFileState } from '../../store/openFile/openFile.atoms';
import { fileSystemState } from '../../store/fileSystem/fileSystem.atoms';
import FileTreeCheckbox from './FileTreeCheckbox';
import { appState } from '../../store/app/app.atoms';

interface Props {
  item: FileSystemItem;
}

const FileTreeFile: React.FC<Props> = (props) => {
  const { item } = props;
  const [fileSystem, setFileSystem] = useRecoilState(fileSystemState);
  const [openFile, setOpenFile] = useRecoilState(openFileState);
  const app = useRecoilValue(appState);

  const handleFileClick = async () => {
    if (openFile?.path !== item.fullPath) {
      await setOpenFileJoinFileSystem(
        item,
        setOpenFile,
        fileSystem,
        setFileSystem
      );
    }

    const editorElement = document.querySelector('[id="editor"]');
    const previewElement = document.querySelector('[id="preview"]');

    if (editorElement && previewElement && editorElement.parentElement) {
      const columnWidth = parseInt(
        window
          .getComputedStyle(editorElement.parentElement)
          .getPropertyValue('grid-template-columns')
      );
      const windowWidth = window.innerWidth;
      const factor = Math.round(windowWidth / columnWidth);

      if (factor === 1) {
        editorElement.scrollIntoView();
      } else {
        previewElement.scrollIntoView();
      }
    }
  };

  return (
    <div
      className={cx(styles.FileTreeFile, {
        [styles.SelectionActive]: app?.showFileDeletionUI,
      })}
    >
      <button
        className={cx(styles.Button, {
          [styles.fileActive]: openFile?.path === item.fullPath,
        })}
        type="button"
        onClick={handleFileClick}
      >
        {openFile?.path === item.fullPath ? <FileEditIcon /> : <FileIcon />}{' '}
        {item.name}
      </button>
      {app?.showFileDeletionUI && (
        <FileTreeCheckbox id={item.id} fileName={item.name} />
      )}
    </div>
  );
};

export default FileTreeFile;
