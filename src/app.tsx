import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { useMemo, useRef, useState } from 'preact/hooks';
import { Editor } from './components/blocks/editor/editor.tsx';
import { MarkeeLogo } from './components/markee-logo.tsx';
import { useMarkee } from './store/store.ts';
import {
    CLEAR_HISTORY_COMMAND,
    LexicalEditor,
    SerializedEditorState,
} from 'lexical';
import useDebounce from './hooks/useDebounce.ts';
import { editorEmptyTemplate } from './store/fs-store-initial.ts';
import { AppBreadcrumb } from './components/app-breadcrumb.tsx';

if (typeof process === 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).process = {
        NODE_ENV: 'production',
        IS_PREACT: 'true',
    };
}

export default function App() {
    const { activeNote, readNoteFileContent, writeNoteFileContent } =
        useMarkee();
    const editorRef = useRef<LexicalEditor>(null);
    const [editorState, setEditorState] =
        useState<SerializedEditorState>(editorEmptyTemplate);

    const handleSerializedEditorChange = (
        serializedEditor: SerializedEditorState
    ) => {
        setEditorState(serializedEditor);
    };

    const updateEditorState = (noteFileContentState: SerializedEditorState) => {
        if (editorRef.current && noteFileContentState) {
            let editorState = editorRef.current.parseEditorState(
                JSON.stringify(noteFileContentState)
            );

            if (editorState.isEmpty()) {
                editorState = editorRef.current.parseEditorState(
                    JSON.stringify(editorEmptyTemplate)
                );
            }

            editorRef.current.setEditorState(editorState);
            editorRef.current.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
        }
    };

    const [, cancel] = useDebounce(
        () => {
            const saveNoteFileLexicalContent = async (
                noteFilePath: string,
                noteFileContent: string
            ) => {
                await writeNoteFileContent(noteFilePath, noteFileContent);
            };
            const noteFilePath = Object.keys(activeNote ?? {})[0];

            if (noteFilePath) {
                saveNoteFileLexicalContent(
                    noteFilePath,
                    JSON.stringify(editorState, null, 2)
                );
            }
        },
        1000,
        [activeNote, editorState]
    );

    useMemo(() => {
        cancel();
        const getNoteFileLexicalContent = async (noteFilePath: string) => {
            const noteFileContentState =
                await readNoteFileContent(noteFilePath);

            updateEditorState(noteFileContentState);
        };
        const noteFilePath = Object.keys(activeNote ?? {})[0];

        if (noteFilePath) {
            getNoteFileLexicalContent(noteFilePath);
        } else {
            updateEditorState(editorEmptyTemplate);
        }
    }, [cancel, activeNote]);

    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 h-4"
                            />
                            <AppBreadcrumb />
                        </div>

                        <div
                            itemScope
                            itemType="http://schema.org/SoftwareApplication"
                            className="min-h-min justify-self-end [&>svg]:min-h-[1.25rem] [&>svg]:pb-1 px-4"
                        >
                            <MarkeeLogo />
                            <p className="text-sm text-nowrap">
                                /mɑːrˈkiː/ notes
                            </p>
                            <h2 className="sr-only">Markee notes</h2>
                        </div>
                    </header>
                    <div className="grid flex-1 grid-cols-1 grid-rows-1 items-start gap-4 p-4 pt-0">
                        {activeNote && Object.keys(activeNote)[0] && (
                            <Editor
                                editorRef={editorRef}
                                editorSerializedState={editorState}
                                onSerializedChange={
                                    handleSerializedEditorChange
                                }
                            />
                        )}
                    </div>
                </SidebarInset>
            </SidebarProvider>
            {process?.env?.NODE_ENV !== 'production' && (
                <>
                    <div className="relative z-10 bg-white">
                        {/*<pre>{JSON.stringify(process.env, null, 4)}</pre>*/}
                    </div>
                </>
            )}
        </>
    );
}
