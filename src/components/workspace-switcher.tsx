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

export function WorkspaceSwitcher({
  workspaces,
}: {
  workspaces: {
    name: string
  }[]
}) {
  const { isMobile } = useSidebar();
  const [activeWorkspace, setActiveWorkspace] = useState(workspaces[0]);
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
                    {activeWorkspace}
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
              {workspaces.map((workspace, index) => (
                <DropdownMenuItem
                  key={workspace}
                  onClick={() => setActiveWorkspace(workspace)}
                  className="gap-2 p-2"
                >
                  {workspace}
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
