import React, { useContext, useState } from 'react';
import cx from 'classnames';
import styles from './FileTreeIterator.module.css';
import FileTreeIterator from './FileTreeIterator';
import { ReactComponent as FolderIcon } from '../../icons/folder.svg';
import { ReactComponent as FolderOpenIcon } from '../../icons/folder-open.svg';
import { GlobalContext } from '../../context/global.context';

function FileTreeFolder(props) {
  const { item, parentIndex } = props;
  const [itemState, setItemState] = useState(item);
  const [globalContext, setGlobalContext] = useContext(GlobalContext);

  const handleFolderClick = (evt) => {
    console.log('handleFolderClick', evt, itemState);
    const content = itemState.content.map((content) => ({
      ...content,
      visible: !content.visible,
    }));

    setItemState({ ...itemState, open: !itemState.open, content: content });

    setGlobalContext({
      ...globalContext,
      focusedFolder: itemState.fullPath,
    });
  };

  return (
    <li
      className={cx(styles.listItem, {
        [styles.listItemCollapsed]: !itemState.visible,
      })}
    >
      <button
        className={cx(styles.folder, {
          [styles.folderActive]: itemState.open,
        })}
        type="button"
        onClick={(evt) => handleFolderClick(evt)}
      >
        {itemState.open ? <FolderOpenIcon /> : <FolderIcon />} {itemState.name}
      </button>
      <FileTreeIterator tree={itemState.content} parentIndex={parentIndex} />
    </li>
  );
}

export default FileTreeFolder;
