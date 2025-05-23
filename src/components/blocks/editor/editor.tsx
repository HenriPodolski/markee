import {
    InitialConfigType,
    LexicalComposer,
} from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, LexicalEditor, SerializedEditorState } from 'lexical';
import { editorTheme } from '@/editor/themes/editor-theme';
import { TooltipProvider } from '@/components/ui/tooltip';
import { nodes } from './nodes';
import { Plugins } from './plugins';
import { MutableRefObject } from 'react';
import { EditorRefPlugin } from '@lexical/react/LexicalEditorRefPlugin';

const editorConfig: InitialConfigType = {
    namespace: 'Editor',
    theme: editorTheme,
    nodes,
    onError: (error: Error) => {
        console.error(error);
    },
};

export function Editor({
    editorState,
    editorSerializedState,
    onChange,
    onSerializedChange,
    editorRef,
}: {
    editorState?: EditorState;
    editorSerializedState?: SerializedEditorState;
    editorRef: MutableRefObject<LexicalEditor | null>;
    onChange?: (editorState: EditorState) => void;
    onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
}) {
    return (
        <div className="overflow-x-hidden min-h-full flex flex-col rounded-lg border bg-background shadow">
            <LexicalComposer
                initialConfig={{
                    ...editorConfig,
                    ...(editorState ? { editorState } : {}),
                    ...(editorSerializedState
                        ? { editorState: JSON.stringify(editorSerializedState) }
                        : {}),
                }}
            >
                <EditorRefPlugin editorRef={editorRef} />
                <TooltipProvider>
                    <Plugins />

                    <OnChangePlugin
                        ignoreSelectionChange={true}
                        onChange={(editorState) => {
                            onChange?.(editorState);
                            onSerializedChange?.(editorState.toJSON());
                        }}
                    />
                </TooltipProvider>
            </LexicalComposer>
        </div>
    );
}
