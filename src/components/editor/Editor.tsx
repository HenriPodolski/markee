import React, { FunctionComponent, useCallback, useEffect } from 'react';
import styles from './Editor.module.scss';
import cx from 'classnames';
import { openFileState } from '../../store/openFile/openFile.atoms';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { appState } from '../../store/app/app.atoms';
import { AppState } from '../../interfaces/AppState.interface';
import EditorToolbar from './EditorToolbar';
import EditorMiniNav from './EditorMiniNav';
import { $getRoot, $getSelection } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import EditorAutoFocusPlugin from './EditorAutoFocusPlugin';
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from '@lexical/markdown';
// lexical, taken from here: https://codesandbox.io/s/lexical-markdown-plugin-example-4076jq?from-embed=&file=/src/styles.css
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { DEFAULT_TRANSFORMERS } from '@lexical/react/LexicalMarkdownShortcutPlugin';

const theme = {
  // Theme styling goes here
};

const onError = (error: any) => {
  console.error(error);
};

export type Props = {
  className: string;
  id?: string;
};

const Editor: FunctionComponent<Props> = ({ id, className }) => {
  const [openFile, setOpenFile] = useRecoilState(openFileState);
  const setApp = useSetRecoilState(appState);
  const editorConfig = {
    namespace: 'MarkeeEditor',
    theme,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
    onError,
  };
  const loadedEditorState = useCallback(() => {
    return $convertFromMarkdownString(openFile?.content ?? '');
  }, [openFile?.content]);

  useEffect(() => {
    return () => {
      setApp((prev: AppState) => ({
        ...prev,
        editorActive: false,
      }));
    };
  }, []);

  // useMemo(() => {
  //   if (openFile?.content) {
  //     const renderedMarkup = md2html
  //       .render(openFile.content)
  //       .replace(/[\r\n]+/g, '');
  //     setConvertedContent(renderedMarkup);
  //   }
  // }, [openFile?.content]);

  // When the editor changes, you can get notified via the
  // LexicalOnChangePlugin!
  const onChange = (editorState: any) => {
    editorState.read(() => {
      // Read the contents of the EditorState here.
      const root = $getRoot();

      const markdown = $convertToMarkdownString(DEFAULT_TRANSFORMERS, root);
      if (
        openFile &&
        openFile.path &&
        !openFile.loading &&
        openFile.content !== markdown
      ) {
        setOpenFile({ ...openFile, content: markdown, saved: false });
        console.log(markdown);
      }
    });
  };

  const handleChange = async (content: string) => {
    // const revisedContent = content.replace('<p><br></p>', '');
    // const markdown = html2md.translate(revisedContent);
    // // this block is used to check if there is any text content
    // const checkElement = document.createElement('div');
    // checkElement.innerHTML = revisedContent;
    // const checkText = checkElement.innerText;
    //
    // if (
    //   openFile &&
    //   openFile.path &&
    //   !openFile.loading &&
    //   checkText &&
    //   openFile.content !== markdown
    // ) {
    //   setOpenFile({ ...openFile, content: markdown, saved: false });
    // }
  };

  const handleFocus = () => {
    setApp((prev: AppState) => ({
      ...prev,
      editorActive: true,
    }));
  };

  const handleBlur = () => {
    setApp((prev: AppState) => ({
      ...prev,
      editorActive: false,
    }));
  };

  return (
    <div id={id} className={cx(styles.Editor, className)}>
      {openFile && (
        <>
          <EditorMiniNav />
          <div className={styles.TextareaWrap} data-editor-ui={true}>
            {/*<ReactQuill*/}
            {/*  key={`editor-${openFile.fileSystemId}`}*/}
            {/*  ref={editorRef}*/}
            {/*  defaultValue={convertedContent}*/}
            {/*  placeholder={'Type here...'}*/}
            {/*  onChange={handleChange}*/}
            {/*  onFocus={handleFocus}*/}
            {/*  onBlur={handleBlur}*/}
            {/*  preserveWhitespace={true}*/}
            {/*  theme="snow"*/}
            {/*  modules={modules}*/}
            {/*  formats={formats}*/}
            {/*/>*/}
            <LexicalComposer
              initialConfig={{
                ...editorConfig,
                editorState: loadedEditorState,
              }}
            >
              <RichTextPlugin
                contentEditable={<ContentEditable />}
                placeholder={<div>Enter some text...</div>}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <OnChangePlugin onChange={onChange} />
              <HistoryPlugin />
              <EditorAutoFocusPlugin />
            </LexicalComposer>
            <EditorToolbar key={`editor-toolbar-${openFile.fileSystemId}`} />
          </div>
        </>
      )}
    </div>
  );
};

export default Editor;
