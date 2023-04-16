import React, { FormEvent, FunctionComponent } from 'react';
import styles from './FileTreeFolderNameInput.module.scss';
import { ReactComponent as FolderIcon } from '../../icons/folder.svg';
import { useScrollIntoViewOnMount } from '../../lib/hooks/useScrollIntoViewOnMount';
import { useRecoilState, useRecoilTransaction_UNSTABLE } from 'recoil';
import { appState } from '../../store/app/app.atoms';
import { fileSystemState } from '../../store/fileSystem/fileSystem.atoms';
import { FileSystemTypeEnum } from '../../store/fileSystem/fileSystem.enums';
import { uuid } from '../../lib/uuid';
import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';
import { openFileState } from '../../store/openFile/openFile.atoms';
import { createDirectory } from '../../store/fileSystem/fileSystem.services';

interface Props {}

const FileTreeFolderNameInput: FunctionComponent<Props> = () => {
  const [app, setApp] = useRecoilState(appState);
  const createDirectoryTransaction = useRecoilTransaction_UNSTABLE(
    ({ get, set }) =>
      (newDirectory: FileSystemItem) => {
        const fileSystem = get(fileSystemState);

        set(fileSystemState, {
          ...fileSystem,
          ...newDirectory,
        });

        set(openFileState, {
          content: '',
          fileSystemId: newDirectory.id,
          path: newDirectory.fullPath,
          loading: false,
        });
      }
  );
  const elementRef = useScrollIntoViewOnMount<HTMLFormElement>();

  const handleBlur = () => {
    if (elementRef.current) {
      elementRef.current.submit();
    }
  };

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault();

    const formData = new FormData(evt.target as HTMLFormElement);
    const directoryName = formData.get('folder');

    // Todo: check if folder name already exists in file system on that level
    if (directoryName) {
      const newDirectory = {
        name: directoryName as string,
        id: uuid(),
        fullPath: `${app?.createFolder}/${directoryName}`,
        basePath: app?.createFolder as string,
        type: FileSystemTypeEnum.directory,
        visible: true,
        open: true,
        active: true,
        level: `${app?.createFolder}/${directoryName}`.split('/')
          .length as number,
        modified: new Date(),
      };

      await createDirectory(newDirectory.fullPath);
      createDirectoryTransaction(newDirectory);
    }

    setApp({
      ...app,
      createFolder: '',
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      ref={elementRef}
      className={styles.FileTreeFolderNameInput}
    >
      <FolderIcon />
      <input
        type="text"
        name="folder"
        onBlur={handleBlur}
        autoFocus={true}
        autoComplete="off"
        placeholder="Enter folder name..."
        required
        pattern="[a-zA-Z0-9_-]*"
      />
    </form>
  );
};

export default FileTreeFolderNameInput;
