import React, { FunctionComponent } from 'react';
import styles from './Navbar.module.scss';
import cx from 'classnames';
import { ReactComponent as MarkeeLogo } from '../../icons/markee-logo.svg';
import GoToEditorControl from './controls/GoToEditorControl';
import { useRecoilValue } from 'recoil';
import { appState } from '../../store/app/app.atoms';
import { Breakpoints } from '../../interfaces/AppState.interface';
import { useTranslation } from 'react-i18next';

export type Props = {
  className?: string;
  id?: string;
};
const FileTreeNavbar: FunctionComponent<Props> = ({ id, className }) => {
  const { t } = useTranslation('common');
  const app = useRecoilValue(appState);
  return (
    <div id={id} className={cx(styles.Navbar, className)}>
      <ol className={cx(styles.ControlsList, styles.ControlsListHasLogo)}>
        {app?.breakpoint === Breakpoints.xs && (
          <li>
            <GoToEditorControl />
          </li>
        )}
        <li
          itemScope
          itemType="http://schema.org/SoftwareApplication"
          className={styles.Logo}
        >
          <MarkeeLogo />
          /mɑːrˈkiː/ notes
          <h2 className="visually-hidden">
            {t('markee')} {t('note', { count: 2 })}
          </h2>
        </li>
      </ol>
    </div>
  );
};

export default FileTreeNavbar;
