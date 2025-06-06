import { type Registry } from "shadcn/registry"

export const examples: Registry["items"] = [
  {
    name: "rich-text-editor-demo",
    type: "registry:example",
    registryDependencies: ["rich-text-editor"],
    files: [
      {
        path: "examples/rich-text-editor-demo.tsx",
        type: "registry:example",
      },
    ],
  },
  {
    name: "accordion-demo",
    type: "registry:example",
    registryDependencies: ["accordion"],
    files: [
      {
        path: "examples/accordion-demo.tsx",
        type: "registry:example",
      },
    ],
  }
]
