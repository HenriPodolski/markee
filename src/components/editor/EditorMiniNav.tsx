import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { appState } from '../../store/app/app.atoms';
import { Views } from '../../interfaces/AppState.interface';
import styles from './EditorMiniNav.module.scss';
import { ReactComponent as CheckIcon } from '../../icons/check.svg';
import { ReactComponent as ArrowLeftIcon } from '../../icons/arrow-left.svg';
import moveToFiletree from '../../lib/handlers/move-to-filetree';
import { openFileState } from '../../store/openFile/openFile.atoms';
import { useTranslation } from 'react-i18next';
import { trigger } from '../../lib/events';
import EventsEnum from '../../interfaces/Events.enum';

const EditorMiniNav = () => {
  const { t } = useTranslation('editor');
  const app = useRecoilValue(appState);
  const openFile = useRecoilValue(openFileState);

  useEffect(() => {
    const handleSaveShortcut = async (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        trigger(EventsEnum.EditorSave);
      }
    };

    document.addEventListener('keydown', handleSaveShortcut);
    return () => {
      document.removeEventListener('keydown', handleSaveShortcut);
    };
  }, []);

  const handleSaveButtonClick = async () => {
    trigger(EventsEnum.EditorSave);
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
