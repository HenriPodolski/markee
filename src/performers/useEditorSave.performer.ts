import { useEffect } from 'react';
import { off, on } from '../lib/events';
import EventsEnum from '../interfaces/Events.enum';
import { saveOpenFileContent } from '../store/openFile/openFile.services';
import { getDataFromFrontmatter } from '../lib/get-data-from-markdown';
import { getChangesFromFileSystemItemById } from '../store/fileSystem/fileSystem.services';
import { useRecoilState } from 'recoil';
import { openFileState } from '../store/openFile/openFile.atoms';
import { fileSystemState } from '../store/fileSystem/fileSystem.atoms';

export const useEditorSavePerformer = () => {
  const [openFile, setOpenFile] = useRecoilState(openFileState);
  const [fileSystem, setFileSystem] = useRecoilState(fileSystemState);
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

    setFileSystem(
      getChangesFromFileSystemItemById({
        id: openFile?.fileSystemId as string,
        previousFileSystemTree: fileSystem,
        updateItem: {
          title,
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
  }, [openFile]);
};
