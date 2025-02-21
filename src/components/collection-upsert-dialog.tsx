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
import { ConfigStoreWorkspace } from '../store/config-store-initial.ts';

export function CollectionUpsertDialog({
    setCollectionCreationDialogOpen,
}: {
    setCollectionCreationDialogOpen: SetStateAction<boolean>;
}) {
    const { activeWorkspace, createCollection, workspaceCollections } =
        useMarkee();
    const formSchema = z.object({
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
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const activeWorkspaceName = (
            Object.values(activeWorkspace)?.[0] as ConfigStoreWorkspace
        )?.name;
        await createCollection(activeWorkspaceName, values.title);
        setCollectionCreationDialogOpen(false);
        form.reset();
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Add collection</DialogTitle>
                <DialogDescription>
                    Create a new note collection
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form
                    className="grid gap-4 py-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
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
                        <Button type="submit">Save collection</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
}
