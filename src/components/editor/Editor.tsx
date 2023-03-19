import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  memo,
} from 'react';
import MarkdownIt from 'markdown-it';
import toMarkdown from 'to-markdown';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './Editor.module.scss';
import cx from 'classnames';
import { openFileState } from '../../store/openFile/openFile.atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useDebounce } from '../../lib/hooks/useDebounce';
import { saveOpenFileContent } from '../../store/openFile/openFile.services';
import { updateFileSystemItemById } from '../../store/fileSystem/fileSystem.services';
import { fileSystemState } from '../../store/fileSystem/fileSystem.atoms';

export type Props = {
  className: string;
};

const Editor: React.FC<Props> = ({ className }) => {
  const [openFile, setOpenFile] = useRecoilState(openFileState);
  const [fileSystem, setFileSystem] = useRecoilState(fileSystemState);

  const onChange = async (content: string) => {
    // TODO check why onChange is triggered for other files
    // e.g.check journal.md click, after opening another file
    // // TODO move conversion to md, html into selector
    // md.current.set({
    //   html: true,
    // });
    //
    // const markdown = toMarkdown(content, {
    //   gfm: true,
    //   converters: [],
    // });
    // const html = md.current.render(markdown);
    //

    console.log('onChange', content, openFile);
    const checkElement = document.createElement('div');
    checkElement.innerHTML = content;
    const checkText = checkElement.innerText;

    if (openFile && openFile.path && !openFile.loading && checkText) {
      setOpenFile({ ...openFile, content });
      const savedFile = await saveOpenFileContent(openFile?.path, content);
      setFileSystem(
        updateFileSystemItemById({
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
      {openFile && (
        <ReactQuill
          key={openFile?.path}
          value={openFile?.content}
          onChange={onChange}
          theme="snow"
        />
      )}
    </div>
  );
};

export default Editor;
