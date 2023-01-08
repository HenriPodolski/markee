import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import MarkdownIt from 'markdown-it';
import toMarkdown from 'to-markdown';
// @ts-ignore
import ReactQuill from '@adrianhelvik/react-quill';
import styles from './Editor.module.scss';
import cx from 'classnames';
import { openFileState } from '../../store/openFile/openFile.atoms';
import { useRecoilState } from 'recoil';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import EditorLexicalMarkeePlugin from './EditorLexicalMarkeePlugin';
import { EditorState } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export type Props = {
  className: string;
};

const theme = {
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
};
const onError = (error: Error) => {
  console.error(error);
};

const Editor: React.FC<Props> = ({ className }) => {
  const [placeholder] = useState('Placeholder');

  // const md = useRef(new MarkdownIt());

  const initialConfig = {
    namespace: 'MarkeeEditor',
    theme,
    onError,
  };

  // const onChange = (editorState: EditorState) => {
  //   console.log('onChange() editorState', editorState);
  //
  //   // TODO move conversion to md, html into selector
  //   // md.current.set({
  //   //   html: true,
  //   // });
  //   //
  //   // const markdown = toMarkdown(content, {
  //   //   gfm: true,
  //   //   converters: [],
  //   // });
  //   // const html = md.current.render(markdown);
  //
  //   // if (openFile) {
  //   //   setOpenFile({ ...openFile, content });
  //   // }
  // };

  return (
    <>
      <div className={cx(styles.Editor, className)}>
        <LexicalComposer
          initialConfig={{
            ...initialConfig,
          }}
        >
          <EditorLexicalMarkeePlugin
            contentEditable={<ContentEditable />}
            placeholder={<div>{placeholder}</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
        </LexicalComposer>
        {/*<ReactQuill*/}
        {/*  value={openFile?.content ?? ''}*/}
        {/*  onChange={onChange}*/}
        {/*  placeholder={`${placeholder}`}*/}
        {/*  options={options()}*/}
        {/*/>*/}
      </div>
    </>
  );
};

export default Editor;
