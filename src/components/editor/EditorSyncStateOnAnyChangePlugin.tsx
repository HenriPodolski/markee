import { FunctionComponent, useLayoutEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalEditor } from 'lexical';
import debounce from 'lodash.debounce';

export type OnChangeParams = {
  editor?: LexicalEditor;
};

export type Props = {
  onChange?: ({ editor }: OnChangeParams) => void;
};
const EditorSyncStateOnAnyChangePlugin: FunctionComponent<Props> = ({
  onChange,
}) => {
  const [editor] = useLexicalComposerContext();
  const [content, setContent] = useState('');

  const announceChange = () => {
    if (onChange) {
      onChange({
        editor,
      });
    }
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
  }, [editor, content]);

  return null;
};

export default EditorSyncStateOnAnyChangePlugin;
