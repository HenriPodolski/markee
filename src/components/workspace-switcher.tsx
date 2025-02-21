import { ChevronsUpDown, Plus } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';
import { WorkspaceUpsertDialog } from './workspace-upsert-dialog.tsx';
import { Dialog } from './ui/dialog.tsx';
import { useMarkee } from '../store/store.ts';
import { ConfigStoreWorkspace } from '../store/config-store-initial.ts';

export type Props = {};

export function WorkspaceSwitcher({}: Props) {
    const { workspaces, activeWorkspace, setActiveWorkspace } = useMarkee();
    const { isMobile } = useSidebar();
    const [workspaceCreationDialogOpen, setWorkspaceCreationDialogOpen] =
        useState(false);
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);

    useEffect(() => {
        const handleKeypress = (evt: KeyboardEvent) => {
            evt.preventDefault();
            if (
                evt.ctrlKey &&
                !isNaN(parseInt(evt.key, 10)) &&
                Object.entries(workspaces)?.[parseInt(evt.key, 10) - 1]
            ) {
                const [workspaceFolder, workspace] =
                    // eslint-disable-next-line no-unsafe-optional-chaining
                    Object.entries(workspaces)?.[parseInt(evt.key, 10) - 1];
                setActiveWorkspace(
                    workspaceFolder,
                    workspace as ConfigStoreWorkspace
                );
                setIsDropDownOpen(false);
            }
        };

        if (isDropDownOpen) {
            document.addEventListener('keydown', handleKeypress);
        } else {
            document.removeEventListener('keydown', handleKeypress);
        }

        return () => {
            document.removeEventListener('keydown', handleKeypress);
        };
    }, [isDropDownOpen, workspaces]);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <Dialog
                    open={workspaceCreationDialogOpen}
                    onOpenChange={(open: boolean) =>
                        setWorkspaceCreationDialogOpen(open)
                    }
                >
                    <DropdownMenu
                        open={isDropDownOpen}
                        onOpenChange={(open: boolean) =>
                            setIsDropDownOpen(open)
                        }
                    >
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {
                                            (
                                                Object.values(
                                                    activeWorkspace
                                                )?.[0] as ConfigStoreWorkspace
                                            )?.name
                                        }
                                    </span>
                                </div>
                                <ChevronsUpDown className="ml-auto" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                            align="start"
                            side={isMobile ? 'bottom' : 'right'}
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                                Workspaces
                            </DropdownMenuLabel>
                            {Object.entries(workspaces).map(
                                (
                                    [workspaceFolder, workspace]: [
                                        string,
                                        unknown,
                                    ],
                                    index
                                ) => (
                                    <DropdownMenuItem
                                        key={workspaceFolder}
                                        onClick={() =>
                                            setActiveWorkspace(
                                                workspaceFolder,
                                                workspace as ConfigStoreWorkspace
                                            )
                                        }
                                        className="gap-2 p-2"
                                    >
                                        {
                                            (workspace as ConfigStoreWorkspace)
                                                .name
                                        }
                                        {index + 1 < 10 && (
                                            <DropdownMenuShortcut>
                                                CTRL+{index + 1}
                                            </DropdownMenuShortcut>
                                        )}
                                    </DropdownMenuItem>
                                )
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() =>
                                    setWorkspaceCreationDialogOpen(true)
                                }
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                    <Plus className="size-4" />
                                </div>
                                <div className="font-medium text-muted-foreground">
                                    Add workspace
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <WorkspaceUpsertDialog
                        setWorkspaceCreationDialogOpen={
                            setWorkspaceCreationDialogOpen
                        }
                    />
                </Dialog>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
