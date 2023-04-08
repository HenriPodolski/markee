import React, { FormEvent, FunctionComponent } from 'react';
import styles from './FileTreeFolderNameInput.module.scss';
import { ReactComponent as FolderIcon } from '../../icons/folder.svg';
import { useScrollIntoViewOnMount } from '../../lib/hooks/useScrollIntoViewOnMount';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { appState } from '../../store/app/app.atoms';
import { fileSystemState } from '../../store/fileSystem/fileSystem.atoms';
import { FileSystemTypeEnum } from '../../store/fileSystem/fileSystem.enums';
import { uuid } from '../../lib/uuid';

interface Props {}

const FileTreeFolderNameInput: FunctionComponent<Props> = () => {
  const [app, setApp] = useRecoilState(appState);
  const setFileSystem = useSetRecoilState(fileSystemState);
  const elementRef = useScrollIntoViewOnMount<HTMLFormElement>();

  const handleBlur = () => {
    if (elementRef.current) {
      elementRef.current.submit();
    }
  };

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();

    const formData = new FormData(evt.target as HTMLFormElement);
    const folderName = formData.get('folder');

    // Todo: check if folder name already exists in file system on that level
    if (folderName) {
      const newFolder = {
        name: folderName as string,
        id: uuid(),
        fullPath: `${app?.createFolder}/${folderName}`,
        basePath: app?.createFolder as string,
        type: FileSystemTypeEnum.directory,
        visible: true,
        open: true,
        active: true,
        level: `${app?.createFolder}/${folderName}`.split('/').length as number,
        modified: new Date(),
      };

      // Todo: implement an effect that syncs the folder from the
      //  virtual filesystem to the persistent filesystem
      setFileSystem((prevState) => [...prevState, newFolder]);
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
