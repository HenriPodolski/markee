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
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';
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
    noteContent,
    editorRef,
    onChange,
    onSerializedChange,
}: {
    noteContent: string;
    editorRef: MutableRefObject<LexicalEditor | null>;
    onChange?: (editorState: EditorState) => void;
    onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
}) {
    return (
        <div className="overflow-x-hidden min-h-full flex flex-col rounded-lg border bg-background shadow">
            <LexicalComposer
                initialConfig={{
                    ...editorConfig,
                    editorState: () => {
                        $convertFromMarkdownString(noteContent, TRANSFORMERS);
                    },
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
