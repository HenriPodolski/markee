import { Button } from './ui/button';
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import { Input } from '@/editor/registry/new-york/ui//input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from './ui/form.tsx';
import { useMarkee } from '../store/store.ts';
import { SetStateAction } from 'react';
import {
    ConfigStore,
    ConfigStoreWorkspace,
} from '../store/config-store-initial.ts';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select.tsx';

export function CollectionUpsertDialog({
    setDialogOpen,
    updateCollection,
}: {
    setDialogOpen: SetStateAction<boolean>;
    updateCollection?: ConfigStore['collections'];
}) {
    const {
        config,
        activeWorkspace,
        createCollection,
        moveCollection,
        workspaceCollections,
    } = useMarkee();
    const formSchema = z
        .object({
            title: z
                .string()
                .min(3, {
                    message: 'Collection title must be at least 3 characters.',
                })
                .max(40, {
                    message:
                        'Collection title must not be longer then 40 characters.',
                })
                .regex(/^(?:(?![\\:/*?"<>|]).)*$/, {
                    message:
                        'Collection title must not contain letters / \\ : * ? " < > |',
                })
                .refine(
                    (val) =>
                        !Object.values(workspaceCollections).find(
                            (collection) => collection.name === val
                        ),
                    (val) => ({
                        message: `Collection title must be unique and "${val}" already exists in workspace ${
                            (
                                Object.values(
                                    activeWorkspace
                                )?.[0] as ConfigStoreWorkspace
                            )?.name
                        }`,
                    })
                ),
            workspace: z.string().optional(),
        })
        .refine(
            (val) => {
                if (
                    updateCollection &&
                    Object.keys(config.workspaces).length > 1 &&
                    !val.workspace
                ) {
                    // make required when updating properties
                    // creation is always in activeWorkspace while update
                    // might involve a move to another workspace
                    return false;
                } else if (
                    updateCollection &&
                    Object.keys(config.workspaces).length > 1
                ) {
                    // validation error if collection already exists in workspace
                    return !config.collections[
                        `/${val.workspace}/${val.title}`
                    ];
                }

                return true;
            },
            (val) => ({
                message: `Error moving collection ${val.title} to workspace ${val.workspace}. Make sure the workspace exists and does not contain a collection with the same name!`,
            })
        );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
        },
        ...(updateCollection && {
            values: {
                title: Object.values(updateCollection)?.[0]?.name,
                workspace: (
                    Object.values(activeWorkspace)?.[0] as ConfigStoreWorkspace
                )?.name,
            },
        }),
    });

    function onCancel() {
        setDialogOpen(false);
        form.reset();
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const activeWorkspaceName = (
            Object.values(activeWorkspace)?.[0] as ConfigStoreWorkspace
        )?.name;
        let destWorkspaceName = activeWorkspaceName;

        if (values.workspace) {
            destWorkspaceName = values.workspace;
        }

        if (updateCollection) {
            await moveCollection(
                activeWorkspaceName,
                updateCollection,
                destWorkspaceName,
                values.title
            );
        } else {
            await createCollection(activeWorkspaceName, values.title);
        }

        setDialogOpen(false);
        form.reset();
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>
                    {updateCollection ? 'Edit collection' : 'Add collection'}
                </DialogTitle>
                <DialogDescription>
                    {updateCollection
                        ? `Edit properties of collection ${Object.values(updateCollection)?.[0]?.name}`
                        : 'Create a new note collection'}
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form
                    className="grid gap-4 py-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    {updateCollection &&
                        Object.keys(config.workspaces).length > 1 && (
                            <FormField
                                control={form.control}
                                name="workspace"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel>Workspace</FormLabel>
                                        <Select
                                            className="col-span-3"
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a workspace" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(
                                                    config.workspaces
                                                ).map((workspace) => {
                                                    const workspaceName = (
                                                        workspace as ConfigStoreWorkspace
                                                    ).name;
                                                    return (
                                                        <SelectItem
                                                            key={workspaceName}
                                                            value={
                                                                workspaceName
                                                            }
                                                        >
                                                            {workspaceName}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage className="col-span-3" />
                                    </FormItem>
                                )}
                            />
                        )}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        className="col-span-3"
                                        placeholder="Type in a title for your collection"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="col-span-3" />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">Save collection</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
}
