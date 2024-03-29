import React, { FormEvent, FunctionComponent, useState } from 'react';
import styles from './FileTreeFolderNameInput.module.scss';
import { ReactComponent as FolderIcon } from '../../icons/folder-outline.svg';
import { useRecoilState, useRecoilTransaction_UNSTABLE } from 'recoil';
import { appState } from '../../store/app/app.atoms';
import { fileSystemState } from '../../store/fileSystem/fileSystem.atoms';
import { FileSystemTypeEnum } from '../../store/fileSystem/fileSystem.enums';
import { uuid } from '../../lib/uuid';
import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';
import { openFileState } from '../../store/openFile/openFile.atoms';
import { createDirectory } from '../../store/fileSystem/fileSystem.services';
import { ReactComponent as Check } from '../../icons/check.svg';

interface Props {}

const FileTreeFolderNameInput: FunctionComponent<Props> = () => {
  const [app, setApp] = useRecoilState(appState);
  const [directoryName, setDirectoryName] = useState('');

  const createDirectoryTransaction = useRecoilTransaction_UNSTABLE(
    ({ get, set }) =>
      (newDirectory: FileSystemItem) => {
        const fileSystem = get(fileSystemState);

        set(fileSystemState, [...fileSystem, newDirectory]);

        set(openFileState, {
          content: '',
          fileSystemId: newDirectory.id,
          path: newDirectory.fullPath,
          loading: false,
        });
      }
  );
  const processFolderCreation = async () => {
    // Todo: check if folder name already exists in file system on that level
    if (directoryName) {
      const newDirectory = {
        name: directoryName as string,
        id: uuid(),
        fullPath: `${
          app?.createFolder === '/' ? '/' : `${app?.createFolder}/`
        }${directoryName}`,
        basePath: app?.createFolder === '/' ? '/' : `${app?.createFolder}`,
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

  const handleBlur = () => {
    processFolderCreation();
  };

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    processFolderCreation();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.FileTreeFolderNameInput}>
      <FolderIcon />
      <div className={styles.InputWrap}>
        <input
          type="text"
          name="folder"
          className={styles.InputField}
          onBlur={handleBlur}
          onChange={(evt) => setDirectoryName(evt.target.value)}
          value={directoryName}
          autoFocus={true}
          autoComplete="off"
          placeholder="Enter folder name..."
          required
          pattern="[a-zA-Z0-9_\\-\\.]+"
        />
      </div>
      <button className={styles.SubmitButton} type="submit">
        <span className="visually-hidden">Create folder</span>
        <Check />
      </button>
    </form>
  );
};

export default FileTreeFolderNameInput;
