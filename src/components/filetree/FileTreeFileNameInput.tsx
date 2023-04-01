import React, { FocusEvent, FunctionComponent } from 'react';
import styles from './FileTreeFileNameInput.module.scss';
import { ReactComponent as FileIcon } from '../../icons/file-document-outline.svg';
import { useScrollIntoViewOnMount } from '../../lib/hooks/useScrollIntoViewOnMount';
import { useRecoilState } from 'recoil';
import { appState } from '../../store/app/app.atoms';

interface Props {}

const FileTreeFileNameInput: FunctionComponent<Props> = () => {
  const [app, setApp] = useRecoilState(appState);
  const elementRef = useScrollIntoViewOnMount<HTMLFormElement>();

  const handleBlur = (evt: FocusEvent<HTMLInputElement>) => {
    if (evt.target.value) {
      console.log('save', evt.target.value);
    }

    setApp({
      ...app,
      createFile: '',
    });
  };

  return (
    <form ref={elementRef} className={styles.FileTreeFileNameInput}>
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
