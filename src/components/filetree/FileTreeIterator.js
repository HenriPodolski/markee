import React, { Fragment, useContext, useRef, useState } from 'react';
import styles from './FileTreeIterator.module.css';
import { ReactComponent as FileIcon } from '../../icons/file-document-outline.svg';
import { ReactComponent as FileNewIcon } from '../../icons/file-document-new-outline.svg';
import { ReactComponent as FileEditIcon } from '../../icons/file-document-edit-outline.svg';
import cx from 'classnames';
import FileTreeFolder from './FileTreeFolder';
import { GlobalContext } from '../../context/global.context';
import MarkdownIt from 'markdown-it';

function FileTreeIterator(props) {
  const { tree } = props;
  const [globalContext, setGlobalContext] = useContext(GlobalContext);
  const { openFilePath, newFileCreateRequest, editorFileMarkdown } =
    globalContext;
  const [fsPromise] = useState(globalContext.fs.promises);
  const md = useRef(new MarkdownIt());
  const [newFileName, setNewFileName] = useState('');

  const handleFileClick = async (evt, fullPath) => {
    const fileContent = await fsPromise.readFile(fullPath, {
      encoding: 'utf8',
    });

    setGlobalContext({
      ...globalContext,
      editorFileContent: md.current.render(fileContent),
      openFilePath: fullPath,
    });
  };

  const handleNewFileNameInputBlur = async (evt) => {
    if (!evt.target.value) {
      setGlobalContext({
        ...globalContext,
        newFileCreateRequest: null,
      });
      return;
    }

    const fullPath = `${newFileCreateRequest.createPath}/${evt.target.value}.md`;
    await globalContext.onCreateNewFile(fullPath, editorFileMarkdown);

    const fileContent = await fsPromise.readFile(fullPath, {
      encoding: 'utf8',
    });

    setGlobalContext({
      ...globalContext,
      editorFileContent: md.current.render(fileContent),
      openFilePath: fullPath,
      updateFileTree: Date.now(),
      newFileCreateRequest: null,
    });
  };

  const handleNewFileNameInputInput = (evt) => {
    let fileName = evt.target.value;
    const regexPattern = evt.target.getAttribute('pattern').replace('[', '[^');
    const pattern = new RegExp(`${regexPattern}`, 'gm');

    fileName = fileName.replaceAll(pattern, '');
    setNewFileName(fileName);
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
          return (
            <Fragment key={`${item.name + i}`}>
              {item.type === 'directory' ? (
                <FileTreeFolder
                  key={`${item.name}-${item.visible ? 'open' : 'close'}-${i}`}
                  item={item}
                  parentIndex={i}
                />
              ) : (
                <li
                  className={cx(styles.listItem, {
                    [styles.listItemCollapsed]: !item.visible,
                  })}
                >
                  <button
                    className={cx(styles.file, {
                      [styles.fileActive]: openFilePath === item.fullPath,
                    })}
                    type="button"
                    onClick={(evt) => handleFileClick(evt, item.fullPath, i)}
                  >
                    {openFilePath === item.fullPath ? (
                      <FileEditIcon />
                    ) : (
                      <FileIcon />
                    )}{' '}
                    {item.name}
                  </button>
                </li>
              )}
              {newFileCreateRequest &&
                tree.length - 1 === i &&
                newFileCreateRequest.level === item.level && (
                  <li className={cx(styles.listItemForm)} key={'new'}>
                    <FileNewIcon />
                    <span className={styles.inputWrap}>
                      <span className={styles.reflectFormField}>
                        {newFileName}
                      </span>
                      <input
                        className={styles.input}
                        type="text"
                        value={newFileName}
                        pattern="[a-zA-Z0-9-_.]"
                        autoFocus
                        onInput={handleNewFileNameInputInput}
                        onChange={handleNewFileNameInputInput}
                        onPaste={handleNewFileNameInputInput}
                        onBlur={handleNewFileNameInputBlur}
                      />
                      <span>.md</span>
                    </span>
                  </li>
                )}
            </Fragment>
          );
        })}
    </ol>
  );
}

export default FileTreeIterator;
