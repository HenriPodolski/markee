import React, { useState, useMemo } from 'react';
import toMarkdown from 'to-markdown';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './Editor.module.scss';
import cx from 'classnames';
import { openFileState } from '../../store/openFile/openFile.atoms';
import { useRecoilState } from 'recoil';
import { saveOpenFileContent } from '../../store/openFile/openFile.services';
import { getChangesFromFileSystemItemById } from '../../store/fileSystem/fileSystem.services';
import { fileSystemState } from '../../store/fileSystem/fileSystem.atoms';
import MarkdownIt from 'markdown-it';

export type Props = {
  className: string;
};

const md = new MarkdownIt({
  html: true,
});

const Editor: React.FC<Props> = ({ className }) => {
  const [openFile, setOpenFile] = useRecoilState(openFileState);
  const [fileSystem, setFileSystem] = useRecoilState(fileSystemState);
  const [convertedContent, setConvertedContent] = useState('');

  useMemo(() => {
    if (openFile?.content) {
      const renderedMarkup = md.render(openFile.content);
      setConvertedContent(renderedMarkup);
    }
  }, [openFile?.content]);

  const onChange = async (content: string) => {
    const markdown = toMarkdown(content, {
      gfm: true,
      converters: [],
    });

    // this block is used to check if there is any text content
    const checkElement = document.createElement('div');
    checkElement.innerHTML = content;
    const checkText = checkElement.innerText;

    if (openFile && openFile.path && !openFile.loading && checkText) {
      setOpenFile({ ...openFile, content });
      const savedFile = await saveOpenFileContent(openFile?.path, markdown);
      setFileSystem(
        getChangesFromFileSystemItemById({
          id: openFile.fileSystemId,
          previousFileSystemTree: fileSystem,
          updateItem: {
            modified: new Date(savedFile.mtimeMs),
          },
        })
      );
    }
  };

  return (
    <div className={cx(styles.Editor, className)}>
      {openFile && convertedContent && (
        <>
          <ReactQuill
            value={convertedContent}
            onChange={onChange}
            theme="snow"
          />
        </>
      )}
    </div>
  );
};

export default Editor;
