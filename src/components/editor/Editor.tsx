import React, { useMemo, useState } from 'react';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import ReactQuill from 'react-quill';
import styles from './Editor.module.scss';
import './quill.snow.scss';
import cx from 'classnames';
import { openFileState } from '../../store/openFile/openFile.atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
import { saveOpenFileContent } from '../../store/openFile/openFile.services';
import { getChangesFromFileSystemItemById } from '../../store/fileSystem/fileSystem.services';
import { fileSystemState } from '../../store/fileSystem/fileSystem.atoms';
import MarkdownIt from 'markdown-it';
import { appState } from '../../store/app/app.atoms';
import { Breakpoints, Views } from '../../interfaces/AppState.interface';

export type Props = {
  className: string;
  id?: string;
};

const md2html = new MarkdownIt();
const html2md = new NodeHtmlMarkdown(
  /* options (optional) */ {},
  /* customTransformers (optional) */ undefined,
  /* customCodeBlockTranslators (optional) */ undefined
);
const Editor: React.FC<Props> = ({ id, className }) => {
  const [openFile, setOpenFile] = useRecoilState(openFileState);
  const [fileSystem, setFileSystem] = useRecoilState(fileSystemState);
  const [convertedContent, setConvertedContent] = useState<string>('');
  const app = useRecoilValue(appState);

  useMemo(() => {
    if (
      app?.breakpoint === Breakpoints.xs &&
      app?.inView?.includes(Views.editor)
    ) {
      const editorElement: HTMLElement | null =
        document.querySelector('.ql-editor');
      if (editorElement) {
        editorElement.focus();
      }
    }
  }, [app?.inView, app?.breakpoint]);

  useMemo(() => {
    if (openFile?.content) {
      const renderedMarkup = md2html.render(openFile.content);
      setConvertedContent(renderedMarkup);
    }
  }, [openFile?.content]);

  const onChange = async (content: string) => {
    const markdown = html2md.translate(content);
    // this block is used to check if there is any text content
    const checkElement = document.createElement('div');
    checkElement.innerHTML = content;
    const checkText = checkElement.innerText;

    if (
      openFile &&
      openFile.path &&
      !openFile.loading &&
      checkText &&
      openFile.content !== markdown
    ) {
      setOpenFile({ ...openFile, content: markdown });
      const savedFile = await saveOpenFileContent(openFile?.path, markdown);
      setFileSystem(
        getChangesFromFileSystemItemById({
          id: openFile.fileSystemId,
          previousFileSystemTree: fileSystem,
          updateItem: {
            modified: new Date(savedFile.mtimeMs),
          },
        })
      );
    }
  };

  return (
    <div id={id} className={cx(styles.Editor, className)}>
      {openFile && (
        <>
          <ReactQuill
            key={openFile.fileSystemId}
            defaultValue={convertedContent}
            placeholder={'Type here...'}
            onChange={onChange}
            theme="snow"
            formats={[
              'header',
              'font',
              'size',
              'bold',
              'italic',
              'underline',
              'strike',
              'blockquote',
              'list',
              'bullet',
              'indent',
              'link',
              'image',
              'color',
            ]}
          />
        </>
      )}
    </div>
  );
};

export default Editor;
