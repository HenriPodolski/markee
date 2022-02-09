import React, { useState } from 'react';
import cx from 'classnames';
import styles from './FileTreeIterator.module.css';
import FileTreeIterator from './FileTreeIterator';
import { ReactComponent as FolderIcon } from '../../icons/folder.svg';

function FileTreeFolder(props) {
  const { item, parentIndex } = props;
  const [itemState, setItemState] = useState(item);

  const handleFolderClick = (evt) => {
    console.log('handleFolderClick', evt, itemState);
    const content = itemState.content.map((content) => ({
      ...content,
      open: !content.open,
    }));

    setItemState({ ...itemState, content: content });
  };

  return (
    <li
      className={cx(styles.listItem, {
        [styles.listItemCollapsed]: !itemState.open,
      })}
    >
      <button
        className={styles.folder}
        type="button"
        onClick={(evt) => handleFolderClick(evt)}
      >
        <FolderIcon /> {itemState.name}
      </button>
      <FileTreeIterator tree={itemState.content} parentIndex={parentIndex} />
    </li>
  );
}

export default FileTreeFolder;
