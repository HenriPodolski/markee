import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FunctionComponent, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { openFileState } from '../../store/openFile/openFile.atoms';
import { OpenFileState } from '../../interfaces/OpenFile.interface';
import { $generateHtmlFromNodes } from '@lexical/html';

const EditorSyncHTMLStatePlugin: FunctionComponent = () => {
  const [editor] = useLexicalComposerContext();
  const setOpenFileState = useSetRecoilState(openFileState);

  useEffect(() => {
    const syncState = () => {
      const htmlString = $generateHtmlFromNodes(editor, null);

      setOpenFileState((prev) => {
        return {
          ...prev,
          html: htmlString.replace(/class="[a-z- ]+?"/gim, ''),
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
  }, [setOpenFileState, editor]);

  return null;
};

export default EditorSyncHTMLStatePlugin;
