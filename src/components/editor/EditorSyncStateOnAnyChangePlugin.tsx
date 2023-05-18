import { FunctionComponent, useLayoutEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import debounce from 'lodash.debounce';
import { TRANSFORMERS } from '@lexical/markdown';
import { $convertToMarkdownString } from '@lexical/markdown';
import { OpenFileState } from '../../interfaces/OpenFile.interface';
import { $generateHtmlFromNodes } from '@lexical/html';
import { useRecoilState } from 'recoil';
import { openFileState } from '../../store/openFile/openFile.atoms';

export type Props = {
  onChange?: (content: string, title?: string) => void;
  title?: string;
};
const EditorSyncStateOnAnyChangePlugin: FunctionComponent<Props> = ({
  onChange,
  title,
}) => {
  const [editor] = useLexicalComposerContext();
  const [content, setContent] = useState('');
  const [openFile, setOpenFile] = useRecoilState(openFileState);

  const announceChange = () => {
    editor.getEditorState().read(() => {
      const root = $getRoot();
      const htmlString = $generateHtmlFromNodes(editor, null);
      // convert to markdown, save meta data as YAML frontmatter
      const markdown = `
        ${`---\ntitle: ${title}\n---\n`}
        ${$convertToMarkdownString(TRANSFORMERS, root)}
        `.trim();

      if (onChange) {
        onChange(root.getTextContent(), title);
      }

      if (
        openFile &&
        openFile.path &&
        !openFile.loading &&
        openFile?.fileSystemId
      ) {
        setOpenFile((prev) => {
          return {
            ...prev,
            content: markdown,
            html: htmlString.replace(/class="[a-z- ]+?"/gim, ''),
            saved: false,
          } as OpenFileState;
        });
      }
    });
  };

  useLayoutEffect(() => {
    const onAnyChange = debounce(() => {
      announceChange();
    }, 100);

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(() => {
        onAnyChange();
      });
    });

    const removeRootListener = editor.registerRootListener(
      (
        rootElement: HTMLElement | null,
        prevRootElement: HTMLElement | null
      ) => {
        if (prevRootElement !== null) {
          observer.disconnect();
          setContent('');
        }

        if (rootElement !== null) {
          observer.observe(rootElement, {
            attributes: true,
            characterData: true,
            subtree: true,
          });
          setContent('');
        }
      }
    );

    return () => {
      removeRootListener();
    };
  }, [editor, title, content]);

  useLayoutEffect(() => {
    announceChange();
  }, [editor, title]);

  return null;
};

export default EditorSyncStateOnAnyChangePlugin;
