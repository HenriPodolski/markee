import React, { useState, useRef, useEffect } from 'react';
import MarkdownIt from 'markdown-it';
import toMarkdown from 'to-markdown';
import TextLayoutConverter from './filters/text-layout-converter';
// @ts-ignore
import ReactQuill from '@adrianhelvik/react-quill';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectOpenFileContent,
  selectOpenFilePath,
  updateOpenFile,
} from '../../store/slices/openFileSlice';
import styles from './Editor.module.scss';
import cx from 'classnames';

export type Props = {
  className: string;
};

const Editor: React.FC<Props> = ({ className }) => {
  const editorFileContent = useAppSelector(selectOpenFileContent);
  const editorFilePath = useAppSelector(selectOpenFilePath);
  const [placeholder] = useState('Placeholder');
  const editorRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const [value, setValue] = useState('');
  const [path, setPath] = useState('');
  // const md = useRef(new MarkdownIt());

  useEffect(() => {
    if (!value || path !== editorFilePath) {
      setValue(editorFileContent);
    }

    setPath(editorFilePath);
  }, [editorFileContent, editorFilePath]);

  const options = {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'], // toggled buttons
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ header: [1, 2, 3, 4, 5, false] }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      clipboard: {
        matchVisual: false,
      },
    },
    placeholder: '',
    theme: 'snow',
  };

  const onChange = () => {
    if (editorRef.current /* && md.current*/) {
      const editorContentWrapper =
        editorRef.current.querySelector('.ql-editor');
      const content = editorContentWrapper!.innerHTML;

      // TODO move conversion to md, html into selector
      // md.current.set({
      //   html: true,
      // });
      //
      // const markdown = toMarkdown(content, {
      //   gfm: true,
      //   converters: [TextLayoutConverter],
      // });
      // const html = md.current.render(markdown);

      console.log('content', content);

      dispatch(updateOpenFile({ content }));
    }
  };

  return (
    <>
      <div className={cx(styles.Editor, className)} ref={editorRef}>
        <ReactQuill
          value={value}
          onChange={onChange}
          placeholder={`${placeholder}`}
          options={options}
        />
      </div>
    </>
  );
};

export default Editor;
