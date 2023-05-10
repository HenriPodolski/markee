import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  AppState,
  Breakpoints,
  Views,
} from '../../interfaces/AppState.interface';
import { useRecoilState, useRecoilValue } from 'recoil';
import { appState } from '../../store/app/app.atoms';
import { BLUR_COMMAND, COMMAND_PRIORITY_LOW, FOCUS_COMMAND } from 'lexical';

const EditorAutoFocusPlugin: FunctionComponent = () => {
  const [editor] = useLexicalComposerContext();
  const [app] = useRecoilState(appState);
  const [hasFocus, setHasFocus] = useState(false);

  useEffect(
    () =>
      editor.registerCommand(
        BLUR_COMMAND,
        () => {
          setHasFocus(false);
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
    []
  );

  useEffect(
    () =>
      editor.registerCommand(
        FOCUS_COMMAND,
        () => {
          setHasFocus(true);
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
    []
  );

  useEffect(() => {
    if (hasFocus) {
      console.log('editor focus', hasFocus);
    }
  }, [hasFocus]);

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
