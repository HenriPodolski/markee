import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fileSystemFileSave } from '../../../store/slices/fileSystemSlice';
import { selectOpenFileContent } from '../../../store/slices/openFileSlice';

const FileTreeControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const editorFileContent = useAppSelector(selectOpenFileContent);

  const onSaveButtonClick = () => {
    dispatch(fileSystemFileSave(editorFileContent));
  };

  return (
    <div>
      <button type="button">New File</button>
      <button type="button">New Folder</button>
      <button type="button" onClick={onSaveButtonClick}>
        Save
      </button>
    </div>
  );
};

export default FileTreeControls;
