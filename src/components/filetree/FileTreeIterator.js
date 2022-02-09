import React, { useContext, useState } from 'react';
import styles from './FileTreeIterator.module.css';
import { ReactComponent as FileIcon } from '../../icons/file-document-outline.svg';
import cx from 'classnames';
import FileTreeFolder from './FileTreeFolder';
import { GlobalContext } from '../../context/global.context';

function FileTreeIterator(props) {
  const { tree } = props;
  const [globalContext, setGlobalContext] = useContext(GlobalContext);
  const [fsPromise] = useState(globalContext.fs.promises);

  const handleFileClick = async (evt, fullPath) => {
    console.log('handleFileClick', fullPath, evt);
    const fileContent = await fsPromise.readFile(fullPath, {
      encoding: 'utf8',
    });

    setGlobalContext({
      ...globalContext,
      editorFileContent: fileContent,
    });
  };

  return (
    <ol className={styles.FileTreeIterator}>
      {tree
        .sort((a, b) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        })
        .sort((a) => {
          if (a.type === 'directory') return -1;
          if (a.type === 'file') return 1;
          return 0;
        })
        .map((item, i) => {
          if (item.type === 'directory') {
            return (
              <FileTreeFolder
                key={`${item.name}-${item.open ? 'open' : 'close'}-${i}`}
                item={item}
                parentIndex={i}
              />
            );
          } else {
            return (
              <li
                className={cx(styles.listItem, {
                  [styles.listItemCollapsed]: !item.open,
                })}
                key={`${item.name + i}`}
              >
                <button
                  className={styles.file}
                  type="button"
                  onClick={(evt) => handleFileClick(evt, item.fullPath)}
                >
                  <FileIcon /> {item.name}
                </button>
              </li>
            );
          }
        })}
    </ol>
  );
}

export default FileTreeIterator;
