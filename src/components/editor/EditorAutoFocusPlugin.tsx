import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { FunctionComponent, useEffect } from 'react';
import { Breakpoints, Views } from '../../interfaces/AppState.interface';
import { useRecoilValue } from 'recoil';
import { appState } from '../../store/app/app.atoms';

const EditorAutoFocusPlugin: FunctionComponent = () => {
  const [editor] = useLexicalComposerContext();
  const app = useRecoilValue(appState);

  useEffect(() => {
    if (
      app?.breakpoint === Breakpoints.xs &&
      app?.inView?.includes(Views.editor) &&
      editor
    ) {
      editor.focus();
    } else if (
      app?.breakpoint === Breakpoints.xs &&
      !app?.inView?.includes(Views.editor) &&
      editor
    ) {
      editor.blur();
    }
  }, [editor, app?.inView, app?.breakpoint]);

  return null;
};

export default EditorAutoFocusPlugin;
