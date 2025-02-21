import { ComponentProps } from 'react';
import { FolderCog, Settings2, Trash2 } from 'lucide-react';
import {
    ConfigStoreCollection,
    ConfigStoreNote,
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

export type AppBreadcrumbProps = {};

export function AppBreadcrumb({
    ...props
}: ComponentProps<AppBreadcrumbProps>) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href={'/'}>markee</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1">
                            {activeWorkspace.name}
                            <Settings2 size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem>
                                <FolderCog className="text-muted-foreground" />
                                <span>Edit workspace properties</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Trash2 className="text-muted-foreground" />
                                <span>Delete workspace</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </BreadcrumbItem>
                {(Object.values(activeCollection)?.[0] as ConfigStoreCollection)
                    ?.name && (
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
                                        <span>Edit collection properties</span>
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
                {(Object.values(activeNote)?.[0] as ConfigStoreNote)?.name && (
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
    );
}
