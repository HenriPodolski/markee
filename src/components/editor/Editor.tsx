import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
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
import EditorSyncStateOnAnyChangePlugin, {
  OnChangeParams,
} from './EditorSyncStateOnAnyChangePlugin';
import { useTranslation } from 'react-i18next';
import { fileSystemItemOfOpenFileSelector } from '../../store/fileSystem/fileSystem.selectors';
import DateOutput from '../shared/DateOutput';
import { useEditorSavePerformer } from '../../performers/useEditorSave.performer';
import { fileSystemState } from '../../store/fileSystem/fileSystem.atoms';
import { applyChangesToFileSystemItems } from '../../store/fileSystem/fileSystem.services';
import { $getRoot, LexicalEditor } from 'lexical';
import { OpenFileState } from '../../interfaces/OpenFile.interface';
import { $generateHtmlFromNodes } from '@lexical/html';
import { TRANSFORMERS } from '@lexical/markdown';
import { $convertToMarkdownString } from '@lexical/markdown';
import { stringify } from 'yaml';

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
  const [openFile, setOpenFile] = useRecoilState(openFileState);
  const setApp = useSetRecoilState(appState);
  const [fileSystem, setFileSystem] = useRecoilState(fileSystemState);
  const fileSystemItem = useRecoilValue(fileSystemItemOfOpenFileSelector);
  useEditorSavePerformer();

  const loadedEditorState = useCallback(() => {
    // remove yaml frontmatter
    const content = (openFile?.content as string).replace(/---(.*?)---/gms, '');
    const editorData = $convertFromMarkdownString(content ?? '');

    return editorData;
  }, [openFile?.content]);

  const modifiedDate = useCallback(() => {
    if (fileSystemItem?.modified) {
      return new Date(fileSystemItem.modified);
    }

    return null;
  }, [fileSystemItem?.modified]);

  useEffect(() => {
    return () => {
      setApp((prev: AppState) => ({
        ...prev,
        editorActive: false,
      }));
    };
  }, []);

  const setFileSystemItemTitle = (title: string) => {
    if (fileSystemItem?.id && fileSystemItem?.title !== title) {
      setFileSystem(
        applyChangesToFileSystemItems({
          itemsToUpdateIds: [fileSystemItem?.id],
          previousFileSystemTree: fileSystem,
          updateObject: {
            title,
          },
        })
      );
      setOpenFile((prev) => {
        const content = (prev?.content as string).replace(/---.*?---/gms, '');
        const yamlContent = stringify({
          title,
          summary: content
            .trim()
            .replace(/\r|\n/, '')
            .replace(/(<([^>]+)>)/gi, '')
            .replace(
              /(?<marks>[`]|\*{1,3}|_{1,3}|~{2})(?<inmarks>.*?)\1|\[(?<link_text>.*)\]\(.*\)/g,
              '$<inmarks>$<link_text>'
            )
            .substring(0, 40),
        });
        const markdownContent = `---\n${yamlContent}---\n${content}`;

        return {
          ...prev,
          content: markdownContent,
          saved: false,
        };
      });
    }
  };

  const handleTitleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const title = evt.target.value;
    setFileSystemItemTitle(title);
  };

  // if store title empty, use first line
  // if changed by the user, use this
  const handleEditorTextChange = ({ editor }: OnChangeParams) => {
    if (!editor) {
      return;
    }

    editor.getEditorState().read(() => {
      const root = $getRoot();
      let title = fileSystemItem?.title ?? '';
      if (!title) {
        const textContent = root.getTextContent();
        const matches = textContent?.match(/.*/);
        if (matches?.[0]) {
          let cleanTitle = matches[0].replaceAll(/[^a-zA-Z0-9,\-_ ]+/gm, '');
          if (cleanTitle.length > 20) {
            cleanTitle = cleanTitle.substring(0, 20);
            const lastSpaceIndex = cleanTitle.lastIndexOf(' ');
            cleanTitle = lastSpaceIndex
              ? cleanTitle.substring(0, lastSpaceIndex)
              : cleanTitle;
          }
          title = cleanTitle ?? fileSystemItem?.title ?? '';
        }
      }

      const htmlContent = $generateHtmlFromNodes(
        editor as LexicalEditor,
        null
      ).replace(/class="[a-z- ]+?"/gim, '');
      const content =
        $convertToMarkdownString(TRANSFORMERS, root) ?? openFile?.content ?? '';
      // convert to markdown, save meta data as YAML frontmatter
      const markdownContent = `
        ---\n
        ${`title: ${title}\n`}
        ${`summary: ${content.substring(0, 20)}\n`}
        ---\n
        ${content}
        `.trim();

      if (
        openFile &&
        openFile.path &&
        !openFile.loading &&
        openFile?.fileSystemId &&
        fileSystemItem?.id &&
        (!openFile.content || openFile.content !== markdownContent)
      ) {
        setOpenFile((prev) => {
          return {
            ...prev,
            content: markdownContent,
            html: htmlContent,
            saved: false,
          } as OpenFileState;
        });
      }
    });
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
              {/*TODO: title input and date, own component*/}
              <div className={styles.TitleForm}>
                <input
                  placeholder={t('title-placeholder') as string}
                  className={styles.TitleInput}
                  onChange={handleTitleChange}
                  value={fileSystemItem?.title ?? ''}
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
