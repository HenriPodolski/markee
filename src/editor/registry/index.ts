import { type Registry } from "shadcn/registry"
import { z } from "zod"

import { blocks } from "@/editor/registry/registry-blocks"
import { charts } from "@/editor/registry/registry-charts"
import { examples } from "@/editor/registry/registry-examples"
import { hooks } from "@/editor/registry/registry-hooks"
import { internal } from "@/editor/registry/registry-internal"
import { lib } from "@/editor/registry/registry-lib"
import { themes } from "@/editor/registry/registry-themes"
import { ui } from "@/editor/registry/registry-ui"

export const registry = {
  name: "shadcn/ui",
  homepage: "https://ui.shadcn.com",
  items: [
    ...ui,
    ...blocks,
    ...charts,
    ...lib,
    ...hooks,
    ...themes,

    // Internal use only.
    ...internal,
    ...examples,
  ],
} satisfies Registry
