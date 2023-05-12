import { FunctionComponent, useLayoutEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, EditorState, LexicalEditor } from 'lexical';
import debounce from 'lodash.debounce';
import { TRANSFORMERS } from '@lexical/markdown';
import { $convertToMarkdownString } from '@lexical/markdown';
import { OpenFileState } from '../../interfaces/OpenFile.interface';
import { $generateHtmlFromNodes } from '@lexical/html';
import { useRecoilState } from 'recoil';
import { openFileState } from '../../store/openFile/openFile.atoms';

export type Props = {
  onChange: (editorState: EditorState, editor: LexicalEditor) => void;
};
const EditorSyncStateOnAnyChangePlugin: FunctionComponent<Props> = ({
  onChange,
}) => {
  const [editor] = useLexicalComposerContext();
  const [content, setContent] = useState('');
  const [openFile, setOpenFile] = useRecoilState(openFileState);

  useLayoutEffect(() => {
    const onAnyChange = debounce(() => {
      editor.getEditorState().read(() => {
        const root = $getRoot();
        const htmlString = $generateHtmlFromNodes(editor, null);
        const markdown = $convertToMarkdownString(TRANSFORMERS, root);

        if (openFile && openFile.path && !openFile.loading) {
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
  }, [editor, content]);

  return null;
};

export default EditorSyncStateOnAnyChangePlugin;
