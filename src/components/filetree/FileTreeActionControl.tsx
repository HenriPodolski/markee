import React, { FunctionComponent } from 'react';
import styles from './FileTreeActionControl.module.scss';
import cx from 'classnames';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import { fileSystemItemsMarkedForDeletion } from '../../store/fileSystem/fileSystem.selectors';
import { appState } from '../../store/app/app.atoms';
import { AppState } from '../../interfaces/AppState.interface';
import { fileSystemState } from '../../store/fileSystem/fileSystem.atoms';
import { deleteFileSystemItem } from '../../store/fileSystem/fileSystem.services';
import { FileSystemTypeEnum } from '../../store/fileSystem/fileSystem.enums';
import { ReactComponent as DeleteIcon } from '../../icons/delete.svg';
import { ReactComponent as CancelIcon } from '../../icons/cancel.svg';

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
    [setApp, setFileSystemItems]
  );

  const handleDeleteButtonClick = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const fileSystemItemsMarked = await snapshot.getPromise(
          fileSystemItemsMarkedForDeletion
        );
        const fileSystemItemsMarkedForDeletionIds = fileSystemItemsMarked.map(
          (item) => item.id
        );

        setApp((prev: AppState) => ({
          ...prev,
          showFileDeletionUI: false,
        }));

        setFileSystemItems((prev) => {
          const updatedFileSystemItems = prev.filter((item) => {
            return !fileSystemItemsMarkedForDeletionIds.includes(item.id);
          });

          return updatedFileSystemItems;
        });

        // delete in order that directories are empty
        // before deletion (because files within directories will be marked recursively)
        [...fileSystemItemsMarked]
          .sort((a, b) => {
            if (
              a.type === FileSystemTypeEnum.directory &&
              b.type === FileSystemTypeEnum.file
            ) {
              return 1;
            }

            if (
              a.type === FileSystemTypeEnum.file &&
              b.type === FileSystemTypeEnum.directory
            ) {
              return -1;
            }

            return 0;
          })
          .forEach(async (itemToDelete) => {
            await deleteFileSystemItem(itemToDelete.fullPath);
          });
      },
    [setApp, setFileSystemItems]
  );

  return (
    <div className={cx(styles.FileTreeActionControl, className)}>
      <button
        className={styles.ActionButton}
        onClick={handleDeleteButtonClick}
        disabled={itemsMarkedForDeletion.length === 0}
      >
        <DeleteIcon />
        <span className={styles.ActionButtonLabel}>Delete</span>
        <sup className={styles.ActionButtonBadge}>
          <span>{itemsMarkedForDeletion.length}</span>
        </sup>
      </button>
      <button className={styles.ActionButton} onClick={handleCancelButtonClick}>
        <CancelIcon />
        <span className={styles.ActionButtonLabel}>Cancel</span>
      </button>
    </div>
  );
};

export default FileTreeActionControl;
