import React, { FormEvent, FunctionComponent, useState } from 'react';
import styles from './FileTreeFileNameInput.module.scss';
import { ReactComponent as FileIcon } from '../../icons/file-document-outline.svg';
import { useRecoilState, useRecoilTransaction_UNSTABLE } from 'recoil';
import { appState } from '../../store/app/app.atoms';
import { uuid } from '../../lib/uuid';
import { FileSystemTypeEnum } from '../../store/fileSystem/fileSystem.enums';
import { fileSystemState } from '../../store/fileSystem/fileSystem.atoms';
import { createFile } from '../../store/fileSystem/fileSystem.services';
import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';
import { openFileState } from '../../store/openFile/openFile.atoms';
import { ReactComponent as Check } from '../../icons/check.svg';

interface Props {}

const FileTreeFileNameInput: FunctionComponent<Props> = () => {
  const [app, setApp] = useRecoilState(appState);
  const [fileName, setFileName] = useState('');
  const createFileTransaction = useRecoilTransaction_UNSTABLE(
    ({ get, set }) =>
      (newFile: FileSystemItem) => {
        const fileSystem = get(fileSystemState);

        set(fileSystemState, [...fileSystem, { ...newFile }]);

        set(openFileState, {
          content: '',
          fileSystemId: newFile.id,
          path: newFile.fullPath,
          loading: false,
        });
      }
  );

  const processFileCreation = async () => {
    // Todo: check if file name already exists in file system on that level
    if (fileName) {
      const extension = fileName.endsWith('.md') ? '' : '.md';
      const newFile = {
        name: `${fileName}${extension}`,
        id: uuid(),
        fullPath: `${app?.createFile}/${fileName}${extension}`,
        basePath: `${app?.createFile}/`,
        type: FileSystemTypeEnum.file,
        visible: true,
        open: true,
        active: true,
        level: `${app?.createFile}/${fileName}${extension}`.split('/')
          .length as number,
        modified: new Date(),
      };

      await createFile(newFile.fullPath);
      createFileTransaction(newFile);
    }

    setApp({
      ...app,
      createFile: '',
    });
  };

  const handleBlur = () => {
    processFileCreation();
  };

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();
    // todo validation of file
    processFileCreation();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.FileTreeFileNameInput}>
      <FileIcon />
      <input
        type="text"
        name="file"
        className={styles.InputField}
        onChange={(evt) => setFileName(evt.target.value)}
        value={fileName}
        onBlur={handleBlur}
        autoFocus={true}
        autoComplete="off"
        placeholder="Enter file name..."
        required
        pattern="[a-zA-Z0-9_\\-\\.]+"
      />
      <button className={styles.SubmitButton} type="submit">
        <span className="visually-hidden">Create folder</span>
        <Check />
      </button>
    </form>
  );
};

export default FileTreeFileNameInput;
