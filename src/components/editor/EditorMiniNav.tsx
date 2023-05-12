import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { appState } from '../../store/app/app.atoms';
import { Views } from '../../interfaces/AppState.interface';
import styles from './EditorMiniNav.module.scss';
import { ReactComponent as CheckIcon } from '../../icons/check.svg';
import { ReactComponent as ArrowLeftIcon } from '../../icons/arrow-left.svg';
import moveToFiletree from '../../lib/handlers/move-to-filetree';
import { saveOpenFileContent } from '../../store/openFile/openFile.services';
import { getChangesFromFileSystemItemById } from '../../store/fileSystem/fileSystem.services';
import { fileSystemState } from '../../store/fileSystem/fileSystem.atoms';
import { openFileState } from '../../store/openFile/openFile.atoms';
import { useTranslation } from 'react-i18next';

const EditorMiniNav = () => {
  const { t } = useTranslation('editor');
  const app = useRecoilValue(appState);
  const [openFile, setOpenFile] = useRecoilState(openFileState);
  const [fileSystem, setFileSystem] = useRecoilState(fileSystemState);

  const save = async () => {
    if (!openFile?.path) {
      console.error('File has no path');
    }

    const savedFile = await saveOpenFileContent(
      openFile?.path as string,
      openFile?.content as string
    );

    setFileSystem(
      getChangesFromFileSystemItemById({
        id: openFile?.fileSystemId as string,
        previousFileSystemTree: fileSystem,
        updateItem: {
          modified: new Date(savedFile.mtimeMs),
        },
      })
    );

    setOpenFile((prev) => ({ ...prev, saved: true }));
  };

  useEffect(() => {
    const handleSaveShortcut = async (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        await save();
      }
    };

    document.addEventListener('keydown', handleSaveShortcut);
    return () => {
      document.removeEventListener('keydown', handleSaveShortcut);
    };
  }, [openFile?.content]);

  const handleSaveButtonClick = async () => {
    await save();
    moveToFiletree();
  };

  const handleBackButtonClick = () => {
    moveToFiletree();
  };

  return (
    <nav className={styles.EditorMiniNav}>
      <ol className={styles.NavList}>
        {!app?.inView?.includes(Views.filetree) && (
          <li>
            <button
              onClick={handleBackButtonClick}
              className={styles.BackButton}
              title={t('mini-navbar-back-a11y-label') as string}
            >
              <ArrowLeftIcon />
              <span className="visually-hidden">
                {t('mini-navbar-back-a11y-label')}
              </span>
            </button>
          </li>
        )}
        <li>
          <button
            disabled={openFile?.saved}
            onClick={handleSaveButtonClick}
            className={styles.SaveButton}
            title={t('mini-navbar-save-a11y-label') as string}
          >
            <CheckIcon />
            <span className="visually-hidden">
              {t('mini-navbar-save-a11y-label')}
            </span>
          </button>
        </li>
      </ol>
    </nav>
  );
};

export default EditorMiniNav;
