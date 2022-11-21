import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectOpenFileContent } from '../../../store/slices/openFileSlice';
import { fileSystemFileSave } from '../../../store/slices/fileSystemSlice';

const SaveFileControl: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const editorFileContent = useAppSelector(selectOpenFileContent);

  const onButtonClick = () => {
    dispatch(fileSystemFileSave(editorFileContent));
  };

  return (
    <button
      className={styles.ControlButton}
      type="button"
      onClick={onButtonClick}
    >
      Save
    </button>
  );
};

export default SaveFileControl;
