'use client'

import { useState } from "react"

import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"

import { TooltipProvider } from "@/editor/registry/new-york/ui/tooltip"

import { editorTheme } from "@/editor/registry/new-york/editor/themes/editor-theme"
import { ContentEditable } from "@/editor/registry/new-york/editor/editor-ui/content-editable"

const editorConfig: InitialConfigType = {
  namespace: 'Editor',
  theme: editorTheme,
  nodes: [],
  onError: (error: Error) => {
    console.error(error)
  },
}

export default function RichTextEditorDemo() {
  return (
    <div className="w-full overflow-hidden rounded-lg border bg-background shadow">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
        }}
      >
        <TooltipProvider>
          <Plugins />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  )
}

const placeholder = 'Press / for commands...'

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <div className="relative">
      {/* toolbar plugins */}
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable placeholder={placeholder} className="ContentEditable__root relative block min-h-72 overflow-auto min-h-full px-8 py-4 focus:outline-none h-72" />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        {/* rest of the plugins */}
      </div>
    </div>
  )
}
