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

export function WorkspaceRemoveDialog({
    setDialogOpen,
    workspaceName,
}: {
    setDialogOpen: SetStateAction<boolean>;
    workspaceName: string;
}) {
    const { removeWorkspace } = useMarkee();
    const formSchema = z.object({
        confirmEntry: z.string().refine(
            (val) => val === workspaceName,
            (val) => ({
                message: `Workspace removal confirmation must be ${workspaceName} and ${val} does not match`,
            })
        ),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            confirmEntry: '',
        },
    });

    function onCancel() {
        setDialogOpen(false);
        form.reset();
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (values.confirmEntry === workspaceName) {
            await removeWorkspace(workspaceName);
            setDialogOpen(false);
            form.reset();
        }
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Delete workspace</DialogTitle>
                <DialogDescription>
                    {`Do you really want to delete the workspace "${workspaceName}
                    "? This deletes the workspace and all its collections and notes. 
                    Please confirm the deletion by entering ${workspaceName} in the field below!`}
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
                                        placeholder="Type in the name of the workspace"
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
                            Delete workspace
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
}
