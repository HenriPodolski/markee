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

export const useEditorSavePerformer = () => {
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

    setFileSystem(
      getChangesFromFileSystemItemById({
        id: openFile?.fileSystemId as string,
        previousFileSystemTree: fileSystem,
        updateItem: {
          title,
          summary,
          modified: new Date(savedFile.mtimeMs),
        },
      })
    );

    setOpenFile((prev) => ({ ...prev, saved: true }));
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
};
