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
    const confirmNonEmptyRemovalFormSchema = z.object({
        confirmEntry: z.string().refine(
            (val) => val === collectionName,
            (val) => ({
                message: `Collection removal confirmation must be ${collectionName} and ${val} does not match`,
            })
        ),
    });
    const confirmNonEmptyRemovalForm = useForm<
        z.infer<typeof confirmNonEmptyRemovalFormSchema>
    >({
        resolver: zodResolver(confirmNonEmptyRemovalFormSchema),
        defaultValues: {
            confirmEntry: '',
        },
    });

    function onCancel() {
        setDialogOpen(false);
        confirmNonEmptyRemovalForm.reset();
    }

    async function onSubmit(
        values: z.infer<typeof confirmNonEmptyRemovalFormSchema>
    ) {
        if (values.confirmEntry === collectionName) {
            await removeCollection(workspaceName, collectionName);
            setDialogOpen(false);
            confirmNonEmptyRemovalForm.reset();
        }
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Delete collection</DialogTitle>
                <DialogDescription>
                    {`Do you really want to delete the collection "${collectionName}
                    "? This deletes the collection and all contained notes. 
                    Please confirm the deletion by entering ${collectionName} in the field below!`}
                </DialogDescription>
            </DialogHeader>
            <Form {...confirmNonEmptyRemovalForm}>
                <form
                    className="grid gap-4 py-4"
                    onSubmit={confirmNonEmptyRemovalForm.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={confirmNonEmptyRemovalForm.control}
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
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" type="submit">
                            Delete collection
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
}
