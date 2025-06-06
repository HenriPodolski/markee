import {
    ChevronRight,
    FileCog,
    FilePenLine,
    FolderCog,
    MoreHorizontal,
    Plus,
    Trash2,
} from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useMarkee } from '../store/store.ts';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { MouseEvent, useState } from 'react';
import { CollectionUpsertDialog } from './collection-upsert-dialog.tsx';
import { Dialog } from './ui/dialog.tsx';
import { NoteUpsertDialog } from './note-upsert-dialog.tsx';
import {
    ConfigStoreNote,
    ConfigStoreWorkspace,
} from '../store/config-store-initial.ts';

export function NavNotes() {
    const {
        activeWorkspace,
        workspaceCollections,
        toggleExpandCollection,
        collectionNotesCallback,
        setActiveNote,
        setActiveCollection,
    } = useMarkee();
    const [collectionCreationDialogOpen, setCollectionCreationDialogOpen] =
        useState(false);
    const [noteCreationDialogOpen, setNoteCreationDialogOpen] = useState(false);
    const { isMobile, setOpenMobile } = useSidebar();

    const handleAddCollectionClick = (evt: MouseEvent) => {
        evt.preventDefault();
        setCollectionCreationDialogOpen(true);
    };

    const handleAddNoteClick = (evt: MouseEvent) => {
        evt.preventDefault();
        setNoteCreationDialogOpen(true);
    };

    const handleOpenNoteClick = (evt: MouseEvent, noteFile: string) => {
        evt.preventDefault();
        setActiveNote(noteFile);
        setOpenMobile(false);
    };

    const truncateTextMiddle = (text: string, maxLengthPx: number) => {
        if (!text) {
            return text;
        }

        const controlElement = document.querySelector(
            `[data-control-px="${text}"]`
        );
        const controlElementText = controlElement?.textContent?.trim();

        if (!controlElementText || !controlElement) {
            return text;
        }

        const width = controlElement.scrollWidth;
        const controlElementCountChars = controlElementText.length;
        const averageWidth = width / controlElementCountChars;
        const maxLength = maxLengthPx / averageWidth;

        if (text.length <= maxLength) {
            return text;
        }

        const ellipsis = `...`;
        const ellipsisLength = ellipsis.length;
        const remainingLength = maxLength - ellipsisLength;

        if (remainingLength < 2) {
            return text.substring(0, maxLength);
        }

        const leftLength = Math.floor(remainingLength / 2);
        const rightLength = remainingLength - leftLength;

        return `${text.substring(0, leftLength)}${ellipsis}${text.substring(text.length - rightLength)}`;
    };

    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>Collections</SidebarGroupLabel>
                <SidebarMenu>
                    {Object.entries(
                        workspaceCollections(
                            (
                                Object.values(
                                    activeWorkspace
                                )?.[0] as ConfigStoreWorkspace
                            )?.name
                        )
                    ).map(([collectionFolder, collection]) => (
                        <Collapsible
                            key={collectionFolder}
                            asChild
                            open={collection.expanded}
                            onOpenChange={() => {
                                if (collection.expanded) {
                                    setActiveNote(null);
                                }
                                toggleExpandCollection(
                                    collectionFolder,
                                    collection
                                );
                            }}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem
                                onClick={() =>
                                    setActiveCollection(
                                        collection,
                                        collectionFolder
                                    )
                                }
                            >
                                <CollapsibleTrigger
                                    className="group-has-data-[sidebar=menu-action]/menu-item:pr-2"
                                    asChild
                                >
                                    <SidebarMenuButton
                                        tooltip={collection.name}
                                    >
                                        {collection.icon && <collection.icon />}
                                        <div className="flex w-fit pr-7 relative">
                                            <span>{collection.name}</span>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <SidebarMenuAction
                                                        showOnHover
                                                    >
                                                        <MoreHorizontal />
                                                        <span className="sr-only">
                                                            More
                                                        </span>
                                                    </SidebarMenuAction>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    className="w-48 rounded-lg"
                                                    side={
                                                        isMobile
                                                            ? 'bottom'
                                                            : 'right'
                                                    }
                                                    align={
                                                        isMobile
                                                            ? 'end'
                                                            : 'start'
                                                    }
                                                >
                                                    <DropdownMenuItem>
                                                        <FolderCog className="text-muted-foreground" />
                                                        <span>
                                                            Edit properties
                                                        </span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>
                                                        <Trash2 className="text-muted-foreground" />
                                                        <span>
                                                            Delete collection
                                                        </span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {(
                                            Object.entries(
                                                collectionNotesCallback(
                                                    collection
                                                )
                                            ) as [string, ConfigStoreNote][]
                                        ).map(([noteFile, note]) => (
                                            <SidebarMenuSubItem key={noteFile}>
                                                <SidebarMenuSubButton asChild>
                                                    <button
                                                        onClick={(
                                                            evt: MouseEvent
                                                        ) =>
                                                            handleOpenNoteClick(
                                                                evt,
                                                                noteFile
                                                            )
                                                        }
                                                        type="button"
                                                        className="contents appearance-none w-full cursor-pointer"
                                                        title={note.name}
                                                    >
                                                        <span className="sr-only">
                                                            {note.name}
                                                        </span>
                                                        <div className="flex w-full relative">
                                                            <span
                                                                className="text-nowrap"
                                                                aria-hidden="true"
                                                            >
                                                                <span
                                                                    data-control-px={
                                                                        note.name
                                                                    }
                                                                    className="invisible absolute -z-10"
                                                                    aria-hidden="true"
                                                                >
                                                                    {note.name}
                                                                </span>
                                                                {truncateTextMiddle(
                                                                    note.name,
                                                                    120
                                                                )}
                                                            </span>
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    asChild
                                                                >
                                                                    <SidebarMenuAction
                                                                        showOnHover
                                                                    >
                                                                        <MoreHorizontal />
                                                                        <span className="sr-only">
                                                                            More
                                                                        </span>
                                                                    </SidebarMenuAction>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent
                                                                    className="w-48 rounded-lg"
                                                                    side={
                                                                        isMobile
                                                                            ? 'bottom'
                                                                            : 'right'
                                                                    }
                                                                    align={
                                                                        isMobile
                                                                            ? 'end'
                                                                            : 'start'
                                                                    }
                                                                >
                                                                    <DropdownMenuItem>
                                                                        <FilePenLine className="text-muted-foreground" />
                                                                        <span>
                                                                            Edit
                                                                            note
                                                                        </span>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem>
                                                                        <FileCog className="text-muted-foreground" />
                                                                        <span>
                                                                            Edit
                                                                            properties
                                                                        </span>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem>
                                                                        <Trash2 className="text-muted-foreground" />
                                                                        <span>
                                                                            Delete
                                                                            note
                                                                        </span>
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </div>
                                                    </button>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                                onClick={(evt: MouseEvent) =>
                                                    handleAddNoteClick(evt)
                                                }
                                                className="gap-2 p-2 select-none"
                                            >
                                                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                                    <Plus className="size-4" />
                                                </div>
                                                <div className="font-medium text-muted-foreground">
                                                    Add note
                                                </div>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ))}
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={handleAddCollectionClick}
                            className="gap-2 p-2 mt-2"
                        >
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                <Plus className="size-4" />
                            </div>
                            <div className="font-medium text-muted-foreground">
                                Add collection
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>

            <Dialog
                open={collectionCreationDialogOpen}
                onOpenChange={(open: boolean) =>
                    setCollectionCreationDialogOpen(open)
                }
            >
                <CollectionUpsertDialog
                    dialogOpen={collectionCreationDialogOpen}
                    setDialogOpen={setCollectionCreationDialogOpen}
                />
            </Dialog>

            <Dialog
                open={noteCreationDialogOpen}
                onOpenChange={(open: boolean) => {
                    setNoteCreationDialogOpen(open);
                }}
            >
                <NoteUpsertDialog
                    dialogOpen={noteCreationDialogOpen}
                    setDialogOpen={setNoteCreationDialogOpen}
                />
            </Dialog>
        </>
    );
}
