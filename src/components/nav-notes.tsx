"use client"

import { ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useMarkee } from "../store/store.ts";

export function NavNotes() {
  const { workspaceCollections, toggleExpandCollection, workspaceNotes } = useMarkee();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Collections</SidebarGroupLabel>
      <SidebarMenu>
        {Object.entries(workspaceCollections).map(([collectionFolder, collection]) => (
          <Collapsible
            key={collectionFolder}
            asChild
            open={collection.expanded}
            onOpenChange={() => toggleExpandCollection(collectionFolder, collection)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={collection.name}>
                  {collection.icon && <collection.icon />}
                  <span>{collection.name}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {Object.entries(workspaceNotes)
                    .filter(([noteFile]) => noteFile.startsWith(collectionFolder))
                    .map((([noteFile, note]) => (
                    <SidebarMenuSubItem key={noteFile}>
                      <SidebarMenuSubButton asChild>
                        <a href="#">
                          <span>{note.name}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
