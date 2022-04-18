import React, { useState, useRef, useContext, useEffect } from 'react';
import MarkdownIt from 'markdown-it';
import toMarkdown from 'to-markdown';
import TextLayoutConverter from './filters/text-layout-converter';
import { GlobalContext } from '../../context/global.context';
// @ts-ignore
import ReactQuill from '@adrianhelvik/react-quill';

interface Props {
  onEditorChange: (editorChangeProps: {
    markdown: string;
    html: string;
    content: string;
  }) => void;
}

const Editor: React.FC<Props> = (props) => {
  const { onEditorChange } = props;
  const [globalContext] = useContext(GlobalContext);
  const { editorFileContent } = globalContext;
  const [placeholder, setPlaceholder] = useState('Placeholder');
  const [value, setValue] = useState<string>();
  const editorRef = useRef<HTMLDivElement>(null);
  const md = useRef(new MarkdownIt());

  useEffect(() => {
    setValue(editorFileContent);
  }, [editorFileContent]);

  const options = {
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'].filter(Boolean), // toggled buttons
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ header: [1, 2, 3, 4, 5, false] }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['clean'],
      ],
      clipboard: {
        matchVisual: false,
      },
    },
    placeholder: '',
    theme: 'snow',
  };

  const onChange = () => {
    if (editorRef.current && md.current) {
      const editorContentWrapper =
        editorRef.current.querySelector('.ql-editor');
      const content = editorContentWrapper!.innerHTML;

      md.current.set({
        html: true,
      });

      const markdown = toMarkdown(content, {
        gfm: true,
        converters: [TextLayoutConverter],
      });
      const html = md.current.render(markdown);

      onEditorChange({ markdown, html, content });
    }
  };

  return (
    <>
      <div ref={editorRef}>
        <ReactQuill
          value={value}
          onChange={onChange}
          placeholder={`${placeholder}`}
          options={options}
        />
      </div>
    </>
  );
};

export default Editor;
