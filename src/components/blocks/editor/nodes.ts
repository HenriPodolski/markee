import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { HashtagNode } from '@lexical/hashtag';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { OverflowNode } from '@lexical/overflow';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import {
    Klass,
    LexicalNode,
    LexicalNodeReplacement,
    ParagraphNode,
    TextNode,
} from 'lexical';

import { AutocompleteNode } from '@/editor/registry/new-york/editor/nodes/autocomplete-node';
import { CollapsibleContainerNode } from '@/editor/registry/new-york/editor/nodes/collapsible-container-node';
import { CollapsibleContentNode } from '@/editor/registry/new-york/editor/nodes/collapsible-content-node';
import { CollapsibleTitleNode } from '@/editor/registry/new-york/editor/nodes/collapsible-title-node';
import { FigmaNode } from '@/editor/registry/new-york/editor/nodes/embeds/figma-node';
import { TweetNode } from '@/editor/registry/new-york/editor/nodes/embeds/tweet-node';
import { YouTubeNode } from '@/editor/registry/new-york/editor/nodes/embeds/youtube-node';
import { EmojiNode } from '@/editor/registry/new-york/editor/nodes/emoji-node';
import { EquationNode } from '@/editor/registry/new-york/editor/nodes/equation-node';
import { ExcalidrawNode } from '@/editor/registry/new-york/editor/nodes/excalidraw-node';
import { ImageNode } from '@/editor/registry/new-york/editor/nodes/image-node';
import { InlineImageNode } from '@/editor/registry/new-york/editor/nodes/inline-image-node';
import { KeywordNode } from '@/editor/registry/new-york/editor/nodes/keyword-node';
import { LayoutContainerNode } from '@/editor/registry/new-york/editor/nodes/layout-container-node';
import { LayoutItemNode } from '@/editor/registry/new-york/editor/nodes/layout-item-node';
import { MentionNode } from '@/editor/registry/new-york/editor/nodes/mention-node';
import { PageBreakNode } from '@/editor/registry/new-york/editor/nodes/page-break-node';
import { PollNode } from '@/editor/registry/new-york/editor/nodes/poll-node';

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
    [
        HeadingNode,
        ParagraphNode,
        TextNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        LinkNode,
        OverflowNode,
        HashtagNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        CodeNode,
        CodeHighlightNode,
        HorizontalRuleNode,
        MentionNode,
        PageBreakNode,
        ImageNode,
        InlineImageNode,
        EmojiNode,
        KeywordNode,
        ExcalidrawNode,
        PollNode,
        LayoutContainerNode,
        LayoutItemNode,
        EquationNode,
        CollapsibleContainerNode,
        CollapsibleContentNode,
        CollapsibleTitleNode,
        AutoLinkNode,
        FigmaNode,
        TweetNode,
        YouTubeNode,
        AutocompleteNode,
    ];
