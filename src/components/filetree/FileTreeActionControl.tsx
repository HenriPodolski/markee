import React, { FunctionComponent } from 'react';
import styles from './FileTreeActionControl.module.scss';
import cx from 'classnames';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import { fileSystemItemsMarkedForDeletion } from '../../store/fileSystem/fileSystem.selectors';
import { appState } from '../../store/app/app.atoms';
import { AppState } from '../../interfaces/AppState.interface';
import { fileSystemState } from '../../store/fileSystem/fileSystem.atoms';

export type Props = {
  className?: string;
};

const FileTreeActionControl: FunctionComponent<Props> = ({
  className,
}: Props) => {
  const itemsMarkedForDeletion = useRecoilValue(
    fileSystemItemsMarkedForDeletion
  );
  const setApp = useSetRecoilState(appState);
  const setFileSystemItems = useSetRecoilState(fileSystemState);

  const handleCancelButtonClick = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const fileSystemItems = await snapshot.getPromise(fileSystemState);
        setApp((prev: AppState) => ({
          ...prev,
          showFileDeletionUI: false,
        }));

        const updatedFileSystemItems = fileSystemItems.map((item) => ({
          ...item,
          markedForDeletion: false,
        }));

        setFileSystemItems(updatedFileSystemItems);
      },
    []
  );

  const handleDeleteButtonClick = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const fileSystemItems = await snapshot.getPromise(
          fileSystemItemsMarkedForDeletion
        );

        setApp((prev: AppState) => ({
          ...prev,
          showFileDeletionUI: false,
        }));

        console.log('Todo: delete this items:', fileSystemItems);
      },
    []
  );

  return (
    <div className={cx(styles.FileTreeActionControl, className)}>
      <div>
        <output>{itemsMarkedForDeletion.length}</output> files marked
      </div>
      {itemsMarkedForDeletion.length > 0 && (
        <button onClick={handleDeleteButtonClick}>
          Delete {itemsMarkedForDeletion.length} files
        </button>
      )}
      <button onClick={handleCancelButtonClick}>Cancel</button>
    </div>
  );
};

export default FileTreeActionControl;
