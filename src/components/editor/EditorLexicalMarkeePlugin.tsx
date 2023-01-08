import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import React, { useEffect, useState } from 'react';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useRecoilState } from 'recoil';
import { openFileState } from '../../store/openFile/openFile.atoms';
import { EditorState } from 'lexical';

const EditorLexicalMarkeePlugin = (props: any) => {
  const [editor] = useLexicalComposerContext();
  const [openFile, setOpenFile] = useRecoilState(openFileState);
  const [initialLoad, setInitialLoad] = useState(false);

  /**
   * Used to update the editor state from openFile.content recoil state
   */
  useEffect(() => {
    if (!initialLoad && openFile?.content) {
      const editorState = editor.parseEditorState(openFile?.content);
      editor.setEditorState(editorState);
      setInitialLoad(true);
    }
  }, [initialLoad, openFile?.content]);

  const onChange = (editorState: EditorState) => {
    if (openFile) {
      setOpenFile({
        ...openFile,
        content: JSON.stringify(editorState),
      });
    }
  };

  return (
    <>
      <PlainTextPlugin {...props} />
      <OnChangePlugin onChange={onChange} />
    </>
  );
};

export default EditorLexicalMarkeePlugin;
