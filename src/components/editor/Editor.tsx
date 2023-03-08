import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import MarkdownIt from 'markdown-it';
import toMarkdown from 'to-markdown';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './Editor.module.scss';
import cx from 'classnames';
import { openFileState } from '../../store/openFile/openFile.atoms';
import { useRecoilState } from 'recoil';

export type Props = {
  className: string;
};

const Editor: React.FC<Props> = ({ className }) => {
  const [openFile, setOpenFile] = useRecoilState(openFileState);

  const onChange = (editorState: any) => {
    console.log('onChange() editorState', editorState);

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
    // if (openFile) {
    //   setOpenFile({ ...openFile, content });
    // }
  };

  return (
    <>
      <div className={cx(styles.Editor, className)}>
        <ReactQuill
          value={openFile?.content ?? ''}
          onChange={onChange}
          theme="snow"
        />
      </div>
    </>
  );
};

export default Editor;
