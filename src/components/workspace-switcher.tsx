import { ChevronsUpDown, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {useState} from "react";
import {WorkspaceCreationDialog} from "./workspace-creation-dialog.tsx";
import {Dialog} from "./ui/dialog.tsx";
import { useMarkee } from "../store/store.ts";
import { ConfigStoreWorkspace } from "../store/config-store-initial.ts";

export type Props = {};

export function WorkspaceSwitcher({}: Props) {
  const { workspaces, activeWorkspace, setActiveWorkspace } = useMarkee();
  const { isMobile } = useSidebar();
  const [workspaceCreationDialogOpen, setWorkspaceCreationDialogOpen] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog open={workspaceCreationDialogOpen}
                onOpenChange={(open: boolean) => setWorkspaceCreationDialogOpen(open) }>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeWorkspace.name}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Workspaces
              </DropdownMenuLabel>
              {Object.entries(workspaces).map(([workspaceFolder, workspace]: [string, unknown], index) => (
                <DropdownMenuItem
                  key={workspaceFolder}
                  onClick={() => setActiveWorkspace(workspaceFolder, workspace as ConfigStoreWorkspace)}
                  className="gap-2 p-2"
                >
                  {(workspace as ConfigStoreWorkspace).name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 p-2">
                <button onClick={() => setWorkspaceCreationDialogOpen(true)} type="button" className="appearance-none contents">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">Add workspace</div>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <WorkspaceCreationDialog setWorkspaceCreationDialogOpen={setWorkspaceCreationDialogOpen} />
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
