import { AppSidebar } from '@/components/app-sidebar';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { SerializedEditorState } from 'lexical';
import { useMemo, useState } from 'react';
import { Editor } from './components/blocks/editor/editor.tsx';
import { MarkeeLogo } from './components/markee-logo.tsx';
import { useMarkee } from './store/store.ts';
import { $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';

if (typeof process === 'undefined') {
    (window as any).process = {
        NODE_ENV: 'production',
        IS_PREACT: 'true',
    };
}

export const initialValue = {
    root: {
        children: [
            {
                children: [
                    {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: 'Hello World 🚀',
                        type: 'text',
                        version: 1,
                    },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1,
            },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'root',
        version: 1,
    },
} as unknown as SerializedEditorState;

export default function App() {
    const [editorState, setEditorState] =
        useState<SerializedEditorState>(initialValue);
    const [noteContent, setNoteContent] = useState(null);
    const { activeWorkspace, activeNote, noteFileContent } = useMarkee();

    useMemo(() => {
        const getNoteFileLexicalContent = async (noteFilePath: string) => {
            const noteFileContentState = await noteFileContent(noteFilePath);
            setNoteContent(noteFileContentState);
        };
        const noteFilePath = Object.keys(activeNote)?.[0];

        if (noteFilePath) {
            getNoteFileLexicalContent(noteFilePath);
        }
    }, [activeNote]);

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
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbPage>
                                            {activeWorkspace.name}
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>
                                            Data Fetching
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>

                        <div
                            itemScope
                            itemType="http://schema.org/SoftwareApplication"
                            className="min-h-min justify-self-end [&>svg]:min-h-[1.25rem] [&>svg]:pb-1 px-4"
                        >
                            <MarkeeLogo />
                            <p className="text-sm">/mɑːrˈkiː/ notes</p>
                            <h2 className="visually-hidden">Markee notes</h2>
                        </div>
                    </header>
                    <div className="grid flex-1 grid-cols-1 grid-rows-1 items-start gap-4 p-4 pt-0">
                        {noteContent && <Editor noteContent={noteContent} />}
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
