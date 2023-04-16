import React, { FormEvent, FunctionComponent } from 'react';
import styles from './FileTreeFileNameInput.module.scss';
import { ReactComponent as FileIcon } from '../../icons/file-document-outline.svg';
import { useScrollIntoViewOnMount } from '../../lib/hooks/useScrollIntoViewOnMount';
import { useRecoilState, useRecoilTransaction_UNSTABLE } from 'recoil';
import { appState } from '../../store/app/app.atoms';
import { uuid } from '../../lib/uuid';
import { FileSystemTypeEnum } from '../../store/fileSystem/fileSystem.enums';
import { fileSystemState } from '../../store/fileSystem/fileSystem.atoms';
import { createFile } from '../../store/fileSystem/fileSystem.services';
import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';
import { openFileState } from '../../store/openFile/openFile.atoms';

interface Props {}

const FileTreeFileNameInput: FunctionComponent<Props> = () => {
  const [app, setApp] = useRecoilState(appState);
  const createFileTransaction = useRecoilTransaction_UNSTABLE(
    ({ get, set }) =>
      (newFile: FileSystemItem) => {
        const fileSystem = get(fileSystemState);

        set(fileSystemState, {
          ...fileSystem,
          ...newFile,
        });

        set(openFileState, {
          content: '',
          fileSystemId: newFile.id,
          path: newFile.fullPath,
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
    const fileName = formData.get('file') as string;

    // Todo: check if file name already exists in file system on that level
    if (fileName) {
      const extension = fileName.endsWith('.md') ? '' : '.md';
      const newFile = {
        name: `${fileName}${extension}`,
        id: uuid(),
        fullPath: `${app?.createFile}/${fileName}${extension}`,
        basePath: app?.createFile as string,
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

  return (
    <form
      onSubmit={handleSubmit}
      ref={elementRef}
      className={styles.FileTreeFileNameInput}
    >
      <FileIcon />
      <input
        type="text"
        name="file"
        onBlur={handleBlur}
        autoFocus={true}
        placeholder="Enter file name..."
        required
        pattern="[a-zA-Z0-9][a-zA-Z0-9_-]*"
      />
    </form>
  );
};

export default FileTreeFileNameInput;
