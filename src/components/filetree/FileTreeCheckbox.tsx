import React, { FunctionComponent } from 'react';
import styles from './FileTreeCheckbox.module.scss';
import { ReactComponent as CheckedBox } from '../../icons/checkbox-checked.svg';
import { ReactComponent as UnCheckedBox } from '../../icons/checkbox.svg';
import { useRecoilState, useRecoilValue } from 'recoil';
import { fileSystemItemByIdSelector } from '../../store/fileSystem/fileSystem.selectors';
import { fileSystemState } from '../../store/fileSystem/fileSystem.atoms';
import { getChangesFromFileSystemItemById } from '../../store/fileSystem/fileSystem.services';

export type Props = {
  id: string;
  fileName: string;
};
const FileTreeCheckbox: FunctionComponent<Props> = ({ id, fileName }) => {
  const fileSystemItem = useRecoilValue(fileSystemItemByIdSelector(id));
  const [fileSystem, setFileSystem] = useRecoilState(fileSystemState);
  const handleClick = () => {
    const updatedFileSystem = getChangesFromFileSystemItemById({
      id,
      previousFileSystemTree: fileSystem,
      updateItem: {
        ...fileSystemItem,
        markedForDeletion: !fileSystemItem?.markedForDeletion,
      },
    });

    setFileSystem(updatedFileSystem);
  };

  return (
    <form className={styles.FileTreeCheckbox}>
      <label htmlFor={`checkbox-${id}`}>
        <span className="visually-hidden">Select {fileName}</span>
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
