import { FolderCog, Settings2, Trash2 } from 'lucide-react';
import {
    ConfigStoreCollection,
    ConfigStoreNote,
    ConfigStoreWorkspace,
} from '../store/config-store-initial.ts';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbLink,
} from '@/components/ui/breadcrumb';
import { Dialog } from '@/components/ui/dialog.tsx';
import { useMarkee } from '../store/store.ts';
import { WorkspaceUpsertDialog } from './workspace-upsert-dialog.tsx';
import { useState } from 'react';
import { WorkspaceRemoveDialog } from './workspace-remove-dialog.tsx';

export function AppBreadcrumb() {
    const {
        activeWorkspace,
        activeCollection,
        activeNote,
        workspaces,
        removeWorkspace,
    } = useMarkee();
    const [workspaceDialogOpen, setWorkspaceDialogOpen] = useState(false);
    const [workspaceRemoveDialogOpen, setWorkspaceRemoveDialogOpen] =
        useState(false);
    return (
        <>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={'/'}>markee</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1">
                                {
                                    (
                                        Object.values(
                                            activeWorkspace
                                        )?.[0] as ConfigStoreWorkspace
                                    )?.name
                                }
                                <Settings2 size={16} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem
                                    onClick={() => setWorkspaceDialogOpen(true)}
                                >
                                    <FolderCog className="text-muted-foreground" />
                                    <span>Edit workspace properties</span>
                                </DropdownMenuItem>
                                {Object.entries(workspaces).length > 1 && (
                                    <DropdownMenuItem
                                        onClick={() =>
                                            setWorkspaceRemoveDialogOpen(true)
                                        }
                                    >
                                        <Trash2 className="text-muted-foreground" />
                                        <span>Delete workspace</span>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </BreadcrumbItem>
                    {(
                        Object.values(
                            activeCollection
                        )?.[0] as ConfigStoreCollection
                    )?.name && (
                        <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-1">
                                        {
                                            (
                                                Object.values(
                                                    activeCollection
                                                )?.[0] as ConfigStoreCollection
                                            )?.name
                                        }
                                        <Settings2 size={16} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        <DropdownMenuItem>
                                            <FolderCog className="text-muted-foreground" />
                                            <span>
                                                Edit collection properties
                                            </span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Trash2 className="text-muted-foreground" />
                                            <span>Delete collection</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </BreadcrumbItem>
                        </>
                    )}
                    {(Object.values(activeNote)?.[0] as ConfigStoreNote)
                        ?.name && (
                        <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-1">
                                        {
                                            (
                                                Object.values(
                                                    activeNote
                                                )?.[0] as ConfigStoreNote
                                            )?.name
                                        }
                                        <Settings2 size={16} />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        <DropdownMenuItem>
                                            <FolderCog className="text-muted-foreground" />
                                            <span>Edit note properties</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Trash2 className="text-muted-foreground" />
                                            <span>Delete note</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </BreadcrumbItem>
                        </>
                    )}
                </BreadcrumbList>
            </Breadcrumb>
            {(Object.values(activeWorkspace)?.[0] as ConfigStoreWorkspace)
                ?.name && (
                <Dialog
                    open={workspaceDialogOpen}
                    onOpenChange={(open: boolean) =>
                        setWorkspaceDialogOpen(open)
                    }
                >
                    <WorkspaceUpsertDialog
                        setDialogOpen={setWorkspaceDialogOpen}
                        updateWorkspace={activeWorkspace}
                    />
                </Dialog>
            )}
            {(Object.values(activeWorkspace)?.[0] as ConfigStoreWorkspace)
                ?.name && (
                <Dialog
                    open={workspaceRemoveDialogOpen}
                    onOpenChange={(open: boolean) =>
                        setWorkspaceRemoveDialogOpen(open)
                    }
                >
                    <WorkspaceRemoveDialog
                        setDialogOpen={setWorkspaceRemoveDialogOpen}
                        workspaceName={
                            (
                                Object.values(
                                    activeWorkspace
                                )?.[0] as ConfigStoreWorkspace
                            )?.name
                        }
                    />
                </Dialog>
            )}
        </>
    );
}
