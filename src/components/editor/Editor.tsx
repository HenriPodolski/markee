import React, {
  ChangeEvent,
  ChangeEventHandler,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styles from './Editor.module.scss';
import cx from 'classnames';
import { openFileState } from '../../store/openFile/openFile.atoms';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { appState } from '../../store/app/app.atoms';
import { AppState } from '../../interfaces/AppState.interface';
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
import { fileSystemItemOfOpenFileSelector } from '../../store/fileSystem/fileSystem.selectors';
import DateOutput from '../shared/DateOutput';

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
  const [title, setTitle] = useState('');
  const [openFile] = useRecoilState(openFileState);
  const setApp = useSetRecoilState(appState);
  const fileSystemItem = useRecoilValue(fileSystemItemOfOpenFileSelector);

  const loadedEditorState = useCallback(() => {
    return $convertFromMarkdownString(openFile?.content ?? '');
  }, [openFile?.content]);

  const modifiedDate = useCallback(() => {
    if (fileSystemItem?.modified) {
      return new Date(fileSystemItem.modified);
    }

    return null;
  }, [fileSystemItem?.modified]);

  useEffect(() => {
    setTitle('');
    return () => {
      setApp((prev: AppState) => ({
        ...prev,
        editorActive: false,
      }));
    };
  }, []);

  useEffect(() => {
    // loads document -> use title from store
    setTitle(fileSystemItem?.title ?? '');
  }, [fileSystemItem?.title, fileSystemItem?.id]);

  const handleTitleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setTitle(evt.target.value);
  };

  // if store title empty, use first line
  // if changed by the user, use this

  const handleEditorTextChange = (content: string) => {
    if (fileSystemItem?.title) {
      return;
    }

    const matches = content.match(/.*/);
    if (matches?.[0]) {
      let cleanTitle = matches[0].replaceAll(/[^a-zA-Z0-9,\-_ ]+/gm, '');
      if (cleanTitle.length > 20) {
        cleanTitle = cleanTitle.substring(0, 20);
        const lastSpaceIndex = cleanTitle.lastIndexOf(' ');
        cleanTitle = lastSpaceIndex
          ? cleanTitle.substring(0, lastSpaceIndex)
          : cleanTitle;
      }
      setTitle(cleanTitle ?? fileSystemItem?.title ?? '');
    } else {
      setTitle('');
    }
  };

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
              <div className={styles.TitleForm}>
                <input
                  placeholder={t('title-placeholder') as string}
                  className={styles.TitleInput}
                  onChange={handleTitleChange}
                  value={title}
                  minLength={2}
                  maxLength={20}
                  type="text"
                />
                {modifiedDate() && (
                  <DateOutput
                    key={`date-output-${fileSystemItem?.id}`}
                    date={modifiedDate() as Date}
                  />
                )}
              </div>
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
                <EditorSyncStateOnAnyChangePlugin
                  onChange={handleEditorTextChange}
                />
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
