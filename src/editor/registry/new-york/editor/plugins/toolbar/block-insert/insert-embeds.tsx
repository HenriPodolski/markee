import { INSERT_EMBED_COMMAND } from '@lexical/react/LexicalAutoEmbedPlugin'

import { useToolbarContext } from '@/editor/registry/new-york/editor/context/toolbar-context'
import { SelectItem } from '@/editor/registry/new-york/ui/select'

import { EmbedConfigs } from '@/editor/registry/new-york/editor/plugins/embeds/auto-embed-plugin'

export function InsertEmbeds() {
  const { activeEditor } = useToolbarContext()
  return EmbedConfigs.map((embedConfig) => (
    <SelectItem
      key={embedConfig.type}
      value={embedConfig.type}
      onPointerUp={() => {
        activeEditor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type)
      }}
      className=""
    >
      <div className="flex items-center gap-1">
        {embedConfig.icon}
        <span>{embedConfig.contentName}</span>
      </div>
    </SelectItem>
  ))
}
