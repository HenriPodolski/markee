import { useState } from 'react'

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin'
import { ClickableLinkPlugin } from '@lexical/react/LexicalClickableLinkPlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin'
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'

import { Separator } from '@/editor/registry/new-york/ui/separator'

import { BlockFormatDropDown } from '@/editor/registry/new-york/editor/plugins/toolbar/block-format-toolbar-plugin'
import { FormatBulletedList } from '@/editor/registry/new-york/editor/plugins/toolbar/block-format/format-bulleted-list'
import { FormatCheckList } from '@/editor/registry/new-york/editor/plugins/toolbar/block-format/format-check-list'
import { FormatCodeBlock } from '@/editor/registry/new-york/editor/plugins/toolbar/block-format/format-code-block'
import { FormatHeading } from '@/editor/registry/new-york/editor/plugins/toolbar/block-format/format-heading'
import { FormatNumberedList } from '@/editor/registry/new-york/editor/plugins/toolbar/block-format/format-numbered-list'
import { FormatParagraph } from '@/editor/registry/new-york/editor/plugins/toolbar/block-format/format-paragraph'
import { FormatQuote } from '@/editor/registry/new-york/editor/plugins/toolbar/block-format/format-quote'
import { BlockInsertPlugin } from '@/editor/registry/new-york/editor/plugins/toolbar/block-insert-plugin'
import { InsertCollapsibleContainer } from '@/editor/registry/new-york/editor/plugins/toolbar/block-insert/insert-collapsible-container'
import { InsertColumnsLayout } from '@/editor/registry/new-york/editor/plugins/toolbar/block-insert/insert-columns-layout'
import { InsertEmbeds } from '@/editor/registry/new-york/editor/plugins/toolbar/block-insert/insert-embeds'
import { InsertExcalidraw } from '@/editor/registry/new-york/editor/plugins/toolbar/block-insert/insert-excalidraw'
import { InsertHorizontalRule } from '@/editor/registry/new-york/editor/plugins/toolbar/block-insert/insert-horizontal-rule'
import { InsertImage } from '@/editor/registry/new-york/editor/plugins/toolbar/block-insert/insert-image'
import { InsertInlineImage } from '@/editor/registry/new-york/editor/plugins/toolbar/block-insert/insert-inline-image'
import { InsertPageBreak } from '@/editor/registry/new-york/editor/plugins/toolbar/block-insert/insert-page-break'
import { InsertPoll } from '@/editor/registry/new-york/editor/plugins/toolbar/block-insert/insert-poll'
import { InsertTable } from '@/editor/registry/new-york/editor/plugins/toolbar/block-insert/insert-table'
import { ClearFormattingToolbarPlugin } from '@/editor/registry/new-york/editor/plugins/toolbar/clear-formatting-toolbar-plugin'
import { CodeLanguageToolbarPlugin } from '@/editor/registry/new-york/editor/plugins/toolbar/code-language-toolbar-plugin'
import { ElementFormatToolbarPlugin } from '@/editor/registry/new-york/editor/plugins/toolbar/element-format-toolbar-plugin'
import { FontBackgroundToolbarPlugin } from '@/editor/registry/new-york/editor/plugins/toolbar/font-background-toolbar-plugin'
import { FontColorToolbarPlugin } from '@/editor/registry/new-york/editor/plugins/toolbar/font-color-toolbar-plugin'
import { FontFamilyToolbarPlugin } from '@/editor/registry/new-york/editor/plugins/toolbar/font-family-toolbar-plugin'
import { FontFormatToolbarPlugin } from '@/editor/registry/new-york/editor/plugins/toolbar/font-format-toolbar-plugin'
import { FontSizeToolbarPlugin } from '@/editor/registry/new-york/editor/plugins/toolbar/font-size-toolbar-plugin'
import { HistoryToolbarPlugin } from '@/editor/registry/new-york/editor/plugins/toolbar/history-toolbar-plugin'
import { LinkToolbarPlugin } from '@/editor/registry/new-york/editor/plugins/toolbar/link-toolbar-plugin'
import { SubSuperToolbarPlugin } from '@/editor/registry/new-york/editor/plugins/toolbar/subsuper-toolbar-plugin'

import { CharacterLimitPlugin } from '@/editor/registry/new-york/editor/plugins/actions/character-limit-plugin'
import { ClearEditorActionPlugin } from '@/editor/registry/new-york/editor/plugins/actions/clear-editor-plugin'
import { EditModeTogglePlugin } from '@/editor/registry/new-york/editor/plugins/actions/edit-mode-toggle-plugin'
import { ImportExportPlugin } from '@/editor/registry/new-york/editor/plugins/actions/import-export-plugin'
import { MarkdownTogglePlugin } from '@/editor/registry/new-york/editor/plugins/actions/markdown-toggle-plugin'
import { MaxLengthPlugin } from '@/editor/registry/new-york/editor/plugins/actions/max-length-plugin'
import { ShareContentPlugin } from '@/editor/registry/new-york/editor/plugins/actions/share-content-plugin'
import { SpeechToTextPlugin } from '@/editor/registry/new-york/editor/plugins/actions/speech-to-text-plugin'
import { TreeViewPlugin } from '@/editor/registry/new-york/editor/plugins/actions/tree-view-plugin'
import { AutoLinkPlugin } from '@/editor/registry/new-york/editor/plugins/auto-link-plugin'
import { AutocompletePlugin } from '@/editor/registry/new-york/editor/plugins/autocomplete-plugin'
import { CodeActionMenuPlugin } from '@/editor/registry/new-york/editor/plugins/code-action-menu-plugin'
import { CodeHighlightPlugin } from '@/editor/registry/new-york/editor/plugins/code-highlight-plugin'
import { CollapsiblePlugin } from '@/editor/registry/new-york/editor/plugins/collapsible-plugin'
import { ComponentPickerMenuPlugin } from '@/editor/registry/new-york/editor/plugins/component-picker-plugin'
import { ContextMenuPlugin } from '@/editor/registry/new-york/editor/plugins/context-menu-plugin'
import { DragDropPastePlugin } from '@/editor/registry/new-york/editor/plugins/drag-drop-paste-plugin'
import { DraggableBlockPlugin } from '@/editor/registry/new-york/editor/plugins/draggable-block-plugin'
import { AutoEmbedPlugin } from '@/editor/registry/new-york/editor/plugins/embeds/auto-embed-plugin'
import { FigmaPlugin } from '@/editor/registry/new-york/editor/plugins/embeds/figma-plugin'
import { TwitterPlugin } from '@/editor/registry/new-york/editor/plugins/embeds/twitter-plugin'
import { YouTubePlugin } from '@/editor/registry/new-york/editor/plugins/embeds/youtube-plugin'
import { EmojiPickerPlugin } from '@/editor/registry/new-york/editor/plugins/emoji-picker-plugin'
import { EmojisPlugin } from '@/editor/registry/new-york/editor/plugins/emojis-plugin'
import { EquationsPlugin } from '@/editor/registry/new-york/editor/plugins/equations-plugin'
import { ExcalidrawPlugin } from '@/editor/registry/new-york/editor/plugins/excalidraw-plugin'
import { FloatingLinkEditorPlugin } from '@/editor/registry/new-york/editor/plugins/floating-link-editor-plugin'
import { FloatingTextFormatToolbarPlugin } from '@/editor/registry/new-york/editor/plugins/floating-text-format-toolbar-plugin'
import { ImagesPlugin } from '@/editor/registry/new-york/editor/plugins/images-plugin'
import { InlineImagePlugin } from '@/editor/registry/new-york/editor/plugins/inline-image-plugin'
import { KeywordsPlugin } from '@/editor/registry/new-york/editor/plugins/keywords-plugin'
import { LayoutPlugin } from '@/editor/registry/new-york/editor/plugins/layout-plugin'
import { LinkPlugin } from '@/editor/registry/new-york/editor/plugins/link-plugin'
import { ListMaxIndentLevelPlugin } from '@/editor/registry/new-york/editor/plugins/list-max-indent-level-plugin'
import { MentionsPlugin } from '@/editor/registry/new-york/editor/plugins/mentions-plugin'
import { PageBreakPlugin } from '@/editor/registry/new-york/editor/plugins/page-break-plugin'
import { PollPlugin } from '@/editor/registry/new-york/editor/plugins/poll-plugin'
import { TabFocusPlugin } from '@/editor/registry/new-york/editor/plugins/tab-focus-plugin'
import { TableActionMenuPlugin } from '@/editor/registry/new-york/editor/plugins/table-action-menu-plugin'
import { TableCellResizerPlugin } from '@/editor/registry/new-york/editor/plugins/table-cell-resizer-plugin'
import { TableHoverActionsPlugin } from '@/editor/registry/new-york/editor/plugins/table-hover-actions-plugin'
import { ToolbarPlugin } from '@/editor/registry/new-york/editor/plugins/toolbar/toolbar-plugin'
import { TypingPerfPlugin } from '@/editor/registry/new-york/editor/plugins/typing-pref-plugin'
import { MARKDOWN_TRANSFORMERS } from '@/editor/registry/new-york/editor/transformers/markdown-transformers'
import { ContentEditable } from '@/editor/registry/new-york/editor/editor-ui/content-editable'

const placeholder = 'Press / for commands...'
const maxLength = 500

export function Plugins({ }) {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <div className="relative">
      <ToolbarPlugin>
        {({ blockType }) => (
          <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto border-b p-1">
            <HistoryToolbarPlugin />
            <Separator orientation="vertical" className="h-8" />
            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={['h1', 'h2', 'h3']} />
              <FormatNumberedList />
              <FormatBulletedList />
              <FormatCheckList />
              <FormatCodeBlock />
              <FormatQuote />
            </BlockFormatDropDown>
            {blockType === 'code' ? (
              <CodeLanguageToolbarPlugin />
            ) : (
              <>
                <FontFamilyToolbarPlugin />
                <FontSizeToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <FontFormatToolbarPlugin format="bold" />
                <FontFormatToolbarPlugin format="italic" />
                <FontFormatToolbarPlugin format="underline" />
                <FontFormatToolbarPlugin format="strikethrough" />
                <Separator orientation="vertical" className="h-8" />
                <SubSuperToolbarPlugin />
                <LinkToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <ClearFormattingToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <FontColorToolbarPlugin />
                <FontBackgroundToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <ElementFormatToolbarPlugin />
                <Separator orientation="vertical" className="h-8" />
                <BlockInsertPlugin>
                  <InsertHorizontalRule />
                  <InsertPageBreak />
                  <InsertImage />
                  <InsertInlineImage />
                  <InsertCollapsibleContainer />
                  <InsertExcalidraw />
                  <InsertTable />
                  <InsertPoll />
                  <InsertColumnsLayout />
                  <InsertEmbeds />
                </BlockInsertPlugin>
              </>
            )}
          </div>
        )}
      </ToolbarPlugin>
      <div className="relative">
        <AutoFocusPlugin />
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable placeholder={placeholder} className='ContentEditable__root relative block min-h-72 overflow-auto min-h-full px-8 py-4 focus:outline-none h-[830px]' />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <ClickableLinkPlugin />
        <CheckListPlugin />
        <HorizontalRulePlugin />
        <TablePlugin />
        <ListPlugin />
        <TabIndentationPlugin />
        <HashtagPlugin />
        <HistoryPlugin />

        <MentionsPlugin />
        <PageBreakPlugin />
        <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
        <KeywordsPlugin />
        <EmojisPlugin />
        <ImagesPlugin />
        <InlineImagePlugin />
        <ExcalidrawPlugin />
        <TableCellResizerPlugin />
        <TableHoverActionsPlugin anchorElem={floatingAnchorElem} />
        <TableActionMenuPlugin
          anchorElem={floatingAnchorElem}
          cellMerge={true}
        />
        <PollPlugin />
        <LayoutPlugin />
        <EquationsPlugin />
        <CollapsiblePlugin />

        <AutoEmbedPlugin />
        <FigmaPlugin />
        <TwitterPlugin />
        <YouTubePlugin />

        <CodeHighlightPlugin />
        <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />

        <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS} />
        <TypingPerfPlugin />
        <TabFocusPlugin />
        <AutocompletePlugin />
        <AutoLinkPlugin />
        <LinkPlugin />

        <ComponentPickerMenuPlugin />
        <ContextMenuPlugin />
        <DragDropPastePlugin />
        <EmojiPickerPlugin />

        <FloatingLinkEditorPlugin anchorElem={floatingAnchorElem} />
        <FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} />

        <ListMaxIndentLevelPlugin />
      </div>
      <div className="clear-both flex h-10 items-center justify-between border-t p-1">
        <MaxLengthPlugin maxLength={maxLength} />
        <CharacterLimitPlugin maxLength={maxLength} charset="UTF-16" />
        <div className="flex justify-end">
          <SpeechToTextPlugin />
          <ShareContentPlugin />
          <ImportExportPlugin />
          <MarkdownTogglePlugin shouldPreserveNewLinesInMarkdown={true} />
          <EditModeTogglePlugin />
          <>
            <ClearEditorActionPlugin />
            <ClearEditorPlugin />
          </>
          <TreeViewPlugin />
        </div>
      </div>
    </div>
  )
}
