import { Button } from './ui/button';
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
} from '@/components/ui/form.tsx';
import { useMarkee } from '../store/store.ts';
import { ClipboardEvent, SetStateAction } from 'react';

export function CollectionRemoveDialog({
    setDialogOpen,
    workspaceName,
    collectionName,
}: {
    setDialogOpen: SetStateAction<boolean>;
    workspaceName: string;
    collectionName: string;
}) {
    const { removeCollection } = useMarkee();
    const formSchema = z.object({
        confirmEntry: z.string().refine(
            (val) => val === collectionName,
            (val) => ({
                message: `Collection removal confirmation must be ${collectionName} and ${val} does not match`,
            })
        ),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            confirmEntry: '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.confirmEntry === collectionName) {
            await removeCollection(workspaceName, collectionName);
            setDialogOpen(false);
            form.reset();
        }
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Remove collection</DialogTitle>
                <DialogDescription>
                    {`Do you really want to remove the collection "${collectionName}
                    "? This removes the collection and all contained notes. 
                    Please confirm the removal by entering ${collectionName} in the field below!`}
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form
                    className="grid gap-4 py-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={form.control}
                        name="confirmEntry"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                                <FormLabel>Confirmation</FormLabel>
                                <FormControl>
                                    <Input
                                        onPaste={(evt: ClipboardEvent) =>
                                            evt.preventDefault()
                                        }
                                        autoComplete="off"
                                        className="col-span-3"
                                        placeholder="Type in the name of the collection"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="col-span-3" />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button variant="destructive" type="submit">
                            Remove collection
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
}
