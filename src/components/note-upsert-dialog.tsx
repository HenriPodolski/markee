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
import { SetStateAction, useEffect } from 'react';
import {
    ConfigStore,
    ConfigStoreCollection,
    ConfigStoreNote,
    ConfigStoreWorkspace,
} from '../store/config-store-initial.ts';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select.tsx';

export function NoteUpsertDialog({
    dialogOpen,
    setDialogOpen,
    updateNote,
}: {
    dialogOpen: boolean;
    setDialogOpen: SetStateAction<boolean>;
    updateNote?: ConfigStore['notes'];
}) {
    const {
        config,
        activeWorkspace,
        activeCollection,
        workspaceCollections,
        createNote,
        moveNote,
        collectionNotesCallback,
    } = useMarkee();
    const formSchema = z
        .object({
            title: z
                .string()
                .min(3, {
                    message: 'Note title must be at least 3 characters.',
                })
                .max(40, {
                    message:
                        'Note title must not be longer then 40 characters.',
                })
                .regex(/^(?:(?![\\:/*?"<>|]).)*$/, {
                    message:
                        'Note title must not contain letters / \\ : * ? " < > |',
                }),
            collection: z.string(),
            workspace: z.string(),
        })
        .refine(
            (val) => {
                if (!val.collection || !val.workspace) {
                    return false;
                }

                return !(
                    Object.values(
                        collectionNotesCallback(val.collection)
                    ) as ConfigStoreNote[]
                ).find((note) => note.name === val.title);
            },
            (val) => ({
                message: `Note title must be unique and "${val.title}" already exists in collection ${val.collection}, workspace ${val.workspace}`,
            })
        );
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: updateNote ? Object.values(updateNote)?.[0]?.name : '',
            collection: (
                Object.values(activeCollection)?.[0] as ConfigStoreCollection
            )?.name,
            workspace: (
                Object.values(activeWorkspace)?.[0] as ConfigStoreWorkspace
            )?.name,
        },
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

        const activeCollectionName = (
            Object.values(activeCollection)?.[0] as ConfigStoreCollection
        )?.name;
        let destCollectionName = activeCollectionName;

        if (Object.keys(workspaceCollections(values.workspace)).length === 1) {
            destCollectionName = Object.values(
                workspaceCollections(values.workspace)
            )?.[0]?.name;
        } else if (values.collection) {
            destCollectionName = values.collection;
        }

        if (updateNote) {
            await moveNote(
                updateNote,
                destWorkspaceName,
                destCollectionName,
                values.title
            );
        } else {
            await createNote(
                destWorkspaceName,
                destCollectionName,
                values.title
            );
        }

        setDialogOpen(false);
        form.reset();
    }

    useEffect(() => {
        if (!dialogOpen) {
            form.reset();
        }

        return () => form.reset();
    }, [dialogOpen]);

    return (
        <DialogContent className="max-w-full sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>
                    {updateNote ? 'Move note' : 'Add Note'}
                </DialogTitle>
                <DialogDescription className="break-all">
                    {updateNote
                        ? `Edit properties of note ${Object.values(updateNote)?.[0]?.name}`
                        : 'Create a new note'}
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form
                    className="grid gap-4 py-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    {updateNote &&
                        Object.values(config.workspaces).filter((workspace) => {
                            return Object.keys(
                                workspaceCollections(
                                    (workspace as ConfigStoreWorkspace).name
                                )
                            ).length;
                        }).length > 1 && (
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

                    {updateNote &&
                        Object.keys(
                            workspaceCollections(form.getValues('workspace'))
                        ).length > 1 && (
                            <FormField
                                control={form.control}
                                name="collection"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel>Collection</FormLabel>
                                        <Select
                                            className="col-span-3"
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a collection" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(
                                                    workspaceCollections(
                                                        form.getValues(
                                                            'workspace'
                                                        )
                                                    )
                                                ).map((collection) => {
                                                    const collectionName = (
                                                        collection as ConfigStoreCollection
                                                    ).name;
                                                    return (
                                                        <SelectItem
                                                            key={collectionName}
                                                            value={
                                                                collectionName
                                                            }
                                                        >
                                                            {collectionName}
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
                                        placeholder="Type in a title for your note"
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
                        <Button type="submit">Save note</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
}
