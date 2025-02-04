import { ListChecksIcon } from 'lucide-react'

import { useToolbarContext } from '@/editor/registry/new-york/editor/context/toolbar-context'
import { SelectItem } from '@/editor/registry/new-york/ui/select'

import { InsertPollDialog } from '@/editor/registry/new-york/editor/plugins/poll-plugin'

export function InsertPoll() {
  const { activeEditor, showModal } = useToolbarContext()

  return (
    <SelectItem
      value="poll"
      onPointerUp={() =>
        showModal('Insert Poll', (onClose) => (
          <InsertPollDialog activeEditor={activeEditor} onClose={onClose} />
        ))
      }
      className=""
    >
      <div className="flex items-center gap-1">
        <ListChecksIcon className="size-4" />
        <span>Poll</span>
      </div>
    </SelectItem>
  )
}
