import { ReactElement, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export function WordCharacterCountPlugin(): ReactElement {
    const [editor] = useLexicalComposerContext();
    const [charsCount, setCharsCount] = useState<number | null>(0);
    const [wordsCount, setWordsCount] = useState<number | null>(0);

    useEffect(() => {
        const removeTextContentListener = editor.registerTextContentListener(
            (textContent) => {
                setCharsCount(textContent.length);
                setWordsCount(
                    textContent.trim().split(/\s+/).filter(Boolean).length
                );
            }
        );

        return () => {
            removeTextContentListener();
        };
    }, [editor]);

    return (
        <div className={`px-1 text-xs text-gray-500`}>
            characters: {charsCount} words: {wordsCount}
        </div>
    );
}
