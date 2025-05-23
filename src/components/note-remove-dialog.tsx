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
    FormMessage,
} from '@/components/ui/form.tsx';
import { useMarkee } from '../store/store.ts';
import { SetStateAction } from 'react';

export function NoteRemoveDialog({
    setDialogOpen,
    workspaceName,
    collectionName,
    noteName,
}: {
    setDialogOpen: SetStateAction<boolean>;
    workspaceName: string;
    collectionName: string;
    noteName: string;
}) {
    const { removeNote } = useMarkee();
    const confirmFormSchema = z.object({
        confirm: z.string().refine(
            (val) => val === noteName,
            () => ({
                message: `Note ${noteName} cannot be removed`,
            })
        ),
    });
    const confirmForm = useForm<z.infer<typeof confirmFormSchema>>({
        resolver: zodResolver(confirmFormSchema),
        defaultValues: {
            confirm: noteName,
        },
    });

    function onCancel() {
        setDialogOpen(false);
        confirmForm.reset();
    }

    async function onSubmit(values: z.infer<typeof confirmFormSchema>) {
        console.log(values.confirm, noteName);
        if (values.confirm === noteName) {
            await removeNote(workspaceName, collectionName, noteName);
            setDialogOpen(false);
            confirmForm.reset();
        }
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Remove note</DialogTitle>
                <DialogDescription>
                    {`Do you really want to remove the note "${noteName}"?`}
                </DialogDescription>
            </DialogHeader>
            <Form {...confirmForm}>
                <form
                    className="grid gap-4 py-4"
                    onSubmit={confirmForm.handleSubmit(onSubmit)}
                >
                    <FormField
                        control={confirmForm.control}
                        name="confirm"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-4 items-center gap-4">
                                <FormControl>
                                    <Input
                                        type="hidden"
                                        {...field}
                                        value={noteName}
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
                            Remove note
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
}
