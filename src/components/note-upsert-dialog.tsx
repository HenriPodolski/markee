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
    ConfigStoreCollection,
    ConfigStoreNote,
    ConfigStoreWorkspace,
} from '../store/config-store-initial.ts';

export function NoteUpsertDialog({
    setCollection,
    collection,
}: {
    setCollection: SetStateAction<ConfigStoreCollection | null>;
    collection: ConfigStoreCollection;
}) {
    const { activeWorkspace, createNote, collectionNotesCallback } =
        useMarkee();
    const formSchema = z.object({
        title: z
            .string()
            .min(3, {
                message: 'Note title must be at least 3 characters.',
            })
            .max(40, {
                message: 'Note title must not be longer then 40 characters.',
            })
            .regex(/^(?:(?![\\:/*?"<>|]).)*$/, {
                message:
                    'Note title must not contain letters / \\ : * ? " < > |',
            })
            .refine(
                (val) =>
                    !(
                        Object.values(
                            collectionNotesCallback(collection)
                        ) as ConfigStoreNote[]
                    ).find((note) => note.name === val),
                (val) => ({
                    message: `Note title must be unique and "${val}" already exists in collection ${collection.name}`,
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
        await createNote(activeWorkspaceName, collection.name, values.title);
        setCollection(null);
        form.reset();
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Add Note</DialogTitle>
                <DialogDescription>Create a new note</DialogDescription>
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
                                        placeholder="Type in a title for your note"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="col-span-3" />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="submit">Save note</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
}
