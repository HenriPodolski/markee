import { useEffect } from 'react';
import { off, on } from '../lib/events';
import EventsEnum from '../interfaces/Events.enum';
import { saveOpenFileContent } from '../store/openFile/openFile.services';
import { getDataFromFrontmatter } from '../lib/get-data-from-markdown';
import { getChangesFromFileSystemItemById } from '../store/fileSystem/fileSystem.services';
import { useRecoilState, useRecoilValue } from 'recoil';
import { openFileState } from '../store/openFile/openFile.atoms';
import { fileSystemState } from '../store/fileSystem/fileSystem.atoms';
import { fileSystemItemOfOpenFileSelector } from '../store/fileSystem/fileSystem.selectors';

export const useEditorSave = () => {
  const [openFile, setOpenFile] = useRecoilState(openFileState);
  const [fileSystem, setFileSystem] = useRecoilState(fileSystemState);
  const fileSystemItem = useRecoilValue(fileSystemItemOfOpenFileSelector);

  const save = async () => {
    if (!openFile?.path) {
      console.error('File has no path', openFile);
      return;
    }

    const savedFile = await saveOpenFileContent(
      openFile?.path as string,
      openFile?.content as string
    );

    const title =
      getDataFromFrontmatter(openFile?.content ?? '', 'title') ?? '';
    const summary =
      getDataFromFrontmatter(openFile?.content ?? '', 'summary') ?? '';

    setOpenFile({ ...openFile, saved: true });

    setFileSystem(
      getChangesFromFileSystemItemById({
        id: openFile?.fileSystemId as string,
        previousFileSystemTree: fileSystem,
        updateItem: {
          title,
          summary,
          modified: new Date(savedFile.mtimeMs).toString(),
        },
      })
    );
  };

  useEffect(() => {
    const handleEditorSaveEvent = async () => {
      await save();
    };
    on(EventsEnum.EditorSave, handleEditorSaveEvent);

    return () => {
      off(EventsEnum.EditorSave, handleEditorSaveEvent);
    };
  }, [openFile?.content, fileSystemItem?.title]);

  return {
    openFile,
    setOpenFile,
    fileSystem,
    setFileSystem,
    fileSystemItem,
  };
};
