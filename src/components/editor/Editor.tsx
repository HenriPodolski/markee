import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import MarkdownIt from 'markdown-it';
import toMarkdown from 'to-markdown';
import TextLayoutConverter from './filters/text-layout-converter';
// @ts-ignore
import ReactQuill from '@adrianhelvik/react-quill';
import styles from './Editor.module.scss';
import cx from 'classnames';
import { openFileState } from '../../store/openFile/openFile.atoms';
import { useRecoilState } from 'recoil';

export type Props = {
  className: string;
};

const Editor: React.FC<Props> = ({ className }) => {
  const [openFile, setOpenFile] = useRecoilState(openFileState);
  const [placeholder] = useState('Placeholder');
  const editorWrapperRef = useRef<HTMLDivElement | null>(null);
  // const md = useRef(new MarkdownIt());

  const options = useCallback(
    () => ({
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
    }),
    []
  );

  const onChange = () => {
    if (editorWrapperRef.current /* && md.current*/) {
      const editorContentWrapper =
        editorWrapperRef.current.querySelector('.ql-editor');
      const content = editorContentWrapper!.innerHTML;
      // setUserSelection(editorRef.current.getEditor().getSelection());

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

      console.log('content', content, openFile);
      if (openFile) {
        setOpenFile({ ...openFile, content });
      }
    }
  };

  return (
    <>
      <div className={cx(styles.Editor, className)} ref={editorWrapperRef}>
        <ReactQuill
          value={openFile?.content ?? ''}
          onChange={onChange}
          placeholder={`${placeholder}`}
          options={options()}
        />
      </div>
    </>
  );
};

export default Editor;
