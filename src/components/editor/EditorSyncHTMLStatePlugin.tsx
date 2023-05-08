import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { FunctionComponent, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { openFileState } from '../../store/openFile/openFile.atoms';
import { OpenFileState } from '../../interfaces/OpenFile.interface';
import { $generateHtmlFromNodes } from '@lexical/html';
import { $getRoot, RootNode } from 'lexical';

const EditorSyncHTMLStatePlugin: FunctionComponent = () => {
  const [editor] = useLexicalComposerContext();
  const setOpenFileState = useSetRecoilState(openFileState);

  useEffect(() => {
    const syncState = () => {
      const htmlString = $generateHtmlFromNodes(editor, null);

      setOpenFileState((prev) => {
        return {
          ...prev,
          html: htmlString,
        } as OpenFileState;
      });
    };
    const removeUpdateListener = editor.registerUpdateListener(
      ({ editorState }) => {
        editorState.read(() => {
          syncState();
        });
      }
    );

    editor.getEditorState().read(() => {
      syncState();
    });

    return () => {
      removeUpdateListener();
    };
  }, [editor]);

  return null;
};

export default EditorSyncHTMLStatePlugin;
