import { useRecoilValue } from 'recoil';
import { appState } from '../../store/app/app.atoms';
import { Views } from '../../interfaces/AppState.interface';
import styles from './EditorMiniNav.module.scss';
import { ReactComponent as CheckIcon } from '../../icons/check.svg';
import { ReactComponent as ArrowLeftIcon } from '../../icons/arrow-left.svg';
import moveToFiletree from '../../lib/handlers/move-to-filetree';

const EditorMiniNav = () => {
  const app = useRecoilValue(appState);
  const handleSaveButtonClick = () => {
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
            >
              <ArrowLeftIcon />
              <span className="visually-hidden">Back</span>
            </button>
          </li>
        )}
        <li>
          <button onClick={handleSaveButtonClick} className={styles.SaveButton}>
            <CheckIcon />
            <span className="visually-hidden">Save</span>
          </button>
        </li>
      </ol>
    </nav>
  );
};

export default EditorMiniNav;
