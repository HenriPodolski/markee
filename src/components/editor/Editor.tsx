import React, { FunctionComponent, useCallback, useEffect } from 'react';
import styles from './Editor.module.scss';
import cx from 'classnames';
import { openFileState } from '../../store/openFile/openFile.atoms';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { appState } from '../../store/app/app.atoms';
import { AppState } from '../../interfaces/AppState.interface';
import EditorToolbar from './EditorToolbar';
import EditorMiniNav from './EditorMiniNav';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import EditorAutoFocusPlugin from './EditorAutoFocusPlugin';
import { $convertFromMarkdownString } from '@lexical/markdown';
// lexical, taken from here: https://codesandbox.io/s/lexical-markdown-plugin-example-4076jq?from-embed=&file=/src/styles.css
// more examples: https://codesandbox.io/u/akmarzhan1, https://codesandbox.io/search?refinementList%5Btemplate%5D=&refinementList%5Bnpm_dependencies.dependency%5D%5B0%5D=lexical&page=1&configure%5BhitsPerPage%5D=12
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import editorRTETheme from './EditorRTETheme';
import EditorToolbarPlugin from './EditorToolbarPlugin';
import EditorSyncStateOnAnyChangePlugin from './EditorSyncStateOnAnyChangePlugin';
import { useTranslation } from 'react-i18next';

const onError = (error: any) => {
  console.error(error);
};

export type Props = {
  className: string;
  id?: string;
};

export const editorNodes = [
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
];

export const editorConfig = {
  namespace: 'MarkeeEditor',
  theme: editorRTETheme,
  nodes: editorNodes,
  onError,
};

const Editor: FunctionComponent<Props> = ({ id, className }) => {
  const { t } = useTranslation('editor');
  const [openFile] = useRecoilState(openFileState);
  const setApp = useSetRecoilState(appState);

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

  // When the editor changes, you can get notified via the
  // LexicalOnChangePlugin!
  const handleChange = (editorState: any) => {};

  return (
    <div id={id} className={cx(styles.Editor, className)}>
      {openFile && (
        <>
          <EditorMiniNav />
          <LexicalComposer
            key={`editor-${openFile.fileSystemId}`}
            initialConfig={{
              ...editorConfig,
              editorState: loadedEditorState,
            }}
          >
            <div
              className={cx(styles.EditorWrap, 'editor-container')}
              data-editor-ui={true}
            >
              <div className={'editor-inner'}>
                <RichTextPlugin
                  contentEditable={
                    <ContentEditable className={'editor-contenteditable'} />
                  }
                  placeholder={
                    <div className={'editor-placeholder'}>
                      {t('editor-placeholder')}
                    </div>
                  }
                  ErrorBoundary={LexicalErrorBoundary}
                />
                <EditorSyncStateOnAnyChangePlugin onChange={handleChange} />
                <HistoryPlugin />
                <EditorAutoFocusPlugin />
              </div>
            </div>
            <EditorToolbarPlugin
              key={`editor-toolbar-${openFile.fileSystemId}`}
            />
          </LexicalComposer>
        </>
      )}
    </div>
  );
};

export default Editor;
