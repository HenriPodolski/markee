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
import { SetStateAction } from 'react';
import { ConfigStore } from '../store/config-store-initial.ts';

export function WorkspaceUpsertDialog({
    setDialogOpen,
    updateWorkspace,
}: {
    setDialogOpen: SetStateAction<boolean>;
    updateWorkspace?: ConfigStore['workspaces'];
}) {
    const { createWorkspace, moveWorkspace, workspaces } = useMarkee();
    const formSchema = z.object({
        title: z
            .string()
            .min(3, {
                message: 'Workspace title must be at least 3 characters.',
            })
            .max(40, {
                message:
                    'Workspace title must not be longer then 40 characters.',
            })
            .regex(/^(?:(?![\\:/*?"<>|]).)*$/, {
                message:
                    'Workspace title must not contain letters / \\ : * ? " < > |',
            })
            .refine(
                (val) =>
                    !Object.values(workspaces).find(
                        (workspace) => workspace.name === val
                    ),
                (val) => ({
                    message: `Workspace title must be unique and ${val} already exists`,
                })
            ),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
        },
        ...(updateWorkspace && {
            values: {
                title: Object.values(updateWorkspace)?.[0]?.name,
            },
        }),
    });

    function onCancel() {
        setDialogOpen(false);
        form.reset();
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (updateWorkspace) {
            await moveWorkspace(updateWorkspace, values.title);
        } else {
            await createWorkspace(values.title);
        }

        setDialogOpen(false);
        form.reset();
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>
                    {updateWorkspace ? 'Edit workspace' : 'Add workspace'}
                </DialogTitle>
                <DialogDescription>
                    {updateWorkspace
                        ? `Edit properties of workspace ${Object.values(updateWorkspace)?.[0]?.name}`
                        : 'Create a new workspace to organize your notes better'}
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
                                        placeholder="Type in a title for your workspace"
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
                        <Button type="submit">Save workspace</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
}
