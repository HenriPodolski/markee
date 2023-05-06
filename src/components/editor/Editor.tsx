import React, { useEffect, useMemo, useRef, useState } from 'react';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import ReactQuill from 'react-quill';
import styles from './Editor.module.scss';
import './quill.snow.scss';
import cx from 'classnames';
import { openFileState } from '../../store/openFile/openFile.atoms';
import { useRecoilState } from 'recoil';
import { saveOpenFileContent } from '../../store/openFile/openFile.services';
import { getChangesFromFileSystemItemById } from '../../store/fileSystem/fileSystem.services';
import { fileSystemState } from '../../store/fileSystem/fileSystem.atoms';
import MarkdownIt from 'markdown-it';
import { appState } from '../../store/app/app.atoms';
import {
  AppState,
  Breakpoints,
  Views,
} from '../../interfaces/AppState.interface';
import EditorToolbar, { modules, formats } from './EditorToolbar';
import EditorMiniNav from './EditorMiniNav';

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
  const [app, setApp] = useRecoilState(appState);
  const editorRef = useRef<ReactQuill>(null);

  useEffect(() => {
    return () => {
      console.log('shut down');
      setApp((prev: AppState) => ({
        ...prev,
        editorActive: false,
      }));
    };
  }, []);

  useEffect(() => {
    if (
      app?.breakpoint === Breakpoints.xs &&
      app?.inView?.includes(Views.editor) &&
      editorRef.current
    ) {
      editorRef.current.focus();
    } else if (
      app?.breakpoint === Breakpoints.xs &&
      !app?.inView?.includes(Views.editor) &&
      editorRef.current
    ) {
      editorRef.current.blur();
    }
  }, [editorRef.current, app?.inView, app?.breakpoint]);

  useMemo(() => {
    if (openFile?.content) {
      const renderedMarkup = md2html.render(openFile.content);
      setConvertedContent(renderedMarkup);
    }
  }, [openFile?.content]);

  const handleChange = async (content: string) => {
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

  const handleFocus = () => {
    console.log('focus');
    setApp((prev: AppState) => ({
      ...prev,
      editorActive: true,
    }));
  };

  const handleBlur = () => {
    console.log('blur');
    setApp((prev: AppState) => ({
      ...prev,
      editorActive: false,
    }));
  };

  return (
    <div id={id} className={cx(styles.Editor, className)}>
      {openFile && (
        <>
          <EditorMiniNav />
          <div className={styles.TextareaWrap} data-editor-ui>
            <ReactQuill
              key={`editor-${openFile.fileSystemId}`}
              ref={editorRef}
              defaultValue={convertedContent}
              placeholder={'Type here...'}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              preserveWhitespace={true}
              theme="snow"
              modules={modules}
              formats={formats}
            />
            <EditorToolbar key={`editor-toolbar-${openFile.fileSystemId}`} />
          </div>
        </>
      )}
    </div>
  );
};

export default Editor;
