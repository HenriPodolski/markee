import React, { FunctionComponent } from 'react';
import styles from './FileTreeCheckbox.module.scss';
import { ReactComponent as CheckedBox } from '../../icons/checkbox-checked.svg';
import { ReactComponent as UnCheckedBox } from '../../icons/checkbox.svg';
import { useRecoilState, useRecoilValue } from 'recoil';
import { fileSystemItemByIdSelector } from '../../store/fileSystem/fileSystem.selectors';
import { fileSystemState } from '../../store/fileSystem/fileSystem.atoms';
import {
  applyChangesToFileSystemItems,
  getChangesFromFileSystemItemById,
} from '../../store/fileSystem/fileSystem.services';
import { FileSystemTypeEnum } from '../../store/fileSystem/fileSystem.enums';
import { FileSystemItem } from '../../interfaces/FileSystemItem.interface';
import { useTranslation } from 'react-i18next';

export type Props = {
  id: string;
  fileName: string;
};
const FileTreeCheckbox: FunctionComponent<Props> = ({ id, fileName }) => {
  const { t } = useTranslation('filetree');
  const fileSystemItem = useRecoilValue(fileSystemItemByIdSelector(id));
  const [fileSystem, setFileSystem] = useRecoilState(fileSystemState);
  const handleClick = () => {
    let updatedFileSystem = fileSystem;

    if (fileSystemItem?.type === FileSystemTypeEnum.file && fileSystemItem) {
      updatedFileSystem = getChangesFromFileSystemItemById({
        id,
        previousFileSystemTree: fileSystem,
        updateItem: {
          ...fileSystemItem,
          markedForDeletion: !fileSystemItem?.markedForDeletion,
        },
      });
    } else if (
      fileSystemItem?.type === FileSystemTypeEnum.directory &&
      fileSystemItem
    ) {
      const fileSystemItemsForDirectory = fileSystem.filter(
        (directoryChildItem: FileSystemItem) => {
          return (
            directoryChildItem.basePath.startsWith(
              `${fileSystemItem.fullPath}/`
            ) || fileSystemItem.id === directoryChildItem.id
          );
        }
      );

      updatedFileSystem = applyChangesToFileSystemItems({
        itemsToUpdateIds: fileSystemItemsForDirectory.map((item) => item.id),
        previousFileSystemTree: fileSystem,
        updateObject: {
          markedForDeletion: !fileSystemItem?.markedForDeletion,
        },
      });
    }

    setFileSystem(updatedFileSystem);
  };

  return (
    <form className={styles.FileTreeCheckbox}>
      <label htmlFor={`checkbox-${id}`}>
        <span className="visually-hidden">
          {t('select-checkbox-a11y-label', { fileName })}
        </span>
        {fileSystemItem?.markedForDeletion ? <CheckedBox /> : <UnCheckedBox />}
      </label>
      <input
        id={`checkbox-${id}`}
        className={styles.Checkbox}
        type="checkbox"
        onClick={handleClick}
      />
    </form>
  );
};

export default FileTreeCheckbox;
