import React, { FocusEvent, FunctionComponent } from 'react';
import styles from './FileTreeFolderNameInput.module.scss';
import { ReactComponent as FolderIcon } from '../../icons/folder.svg';
import { useScrollIntoViewOnMount } from '../../lib/hooks/useScrollIntoViewOnMount';
import { useRecoilState } from 'recoil';
import { appState } from '../../store/app/app.atoms';

interface Props {}

const FileTreeFolderNameInput: FunctionComponent<Props> = () => {
  const [app, setApp] = useRecoilState(appState);
  const elementRef = useScrollIntoViewOnMount<HTMLFormElement>();

  const handleBlur = (evt: FocusEvent<HTMLInputElement>) => {
    if (evt.target.value) {
      console.log('save', evt.target.value);
    }

    setApp({
      ...app,
      createFolder: '',
    });
  };

  return (
    <form ref={elementRef} className={styles.FileTreeFolderNameInput}>
      <FolderIcon />
      <input
        type="text"
        name="folder"
        onBlur={handleBlur}
        autoFocus={true}
        placeholder="Enter folder name..."
        required
        pattern="[a-zA-Z0-9][a-zA-Z0-9_-]*"
      />
    </form>
  );
};

export default FileTreeFolderNameInput;
