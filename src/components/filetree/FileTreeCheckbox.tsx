import React, { FunctionComponent, useState } from 'react';
import styles from './FileTreeCheckbox.module.scss';
import { ReactComponent as CheckedBox } from '../../icons/checkbox-checked.svg';
import { ReactComponent as UnCheckedBox } from '../../icons/checkbox.svg';

export type Props = {
  id: string;
  fileName: string;
};
const FileTreeCheckbox: FunctionComponent<Props> = ({ id, fileName }) => {
  const [checked, setChecked] = useState(false);
  return (
    <form className={styles.FileTreeCheckbox}>
      <label htmlFor={`checkbox-${id}`}>
        <span className="visually-hidden">Select {fileName}</span>
        {checked ? <CheckedBox /> : <UnCheckedBox />}
      </label>
      <input
        id={`checkbox-${id}`}
        className={styles.Checkbox}
        type="checkbox"
        onClick={() => {
          setChecked(!checked);
        }}
      />
    </form>
  );
};

export default FileTreeCheckbox;
