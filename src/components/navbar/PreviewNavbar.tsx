import React, { FunctionComponent } from 'react';
import styles from './Navbar.module.scss';
import cx from 'classnames';
import { ReactComponent as MarkeeLogo } from '../../icons/markee-logo.svg';
import GoToEditorControl from './controls/GoToEditorControl';
import { useRecoilValue } from 'recoil';
import { appState } from '../../store/app/app.atoms';
import { Breakpoints } from '../../interfaces/AppState.interface';

export type Props = {
  className?: string;
  id?: string;
};
const FileTreeNavbar: FunctionComponent<Props> = ({ id, className }) => {
  const app = useRecoilValue(appState);
  return (
    <div id={id} className={cx(styles.Navbar, className)}>
      <ol className={cx(styles.ControlsList, styles.ControlsListHasLogo)}>
        {app?.breakpoint === Breakpoints.xs && (
          <li>
            <GoToEditorControl />
          </li>
        )}
        <li className={styles.Logo}>
          <MarkeeLogo />
          /mɑːrˈkiː/ notes
        </li>
      </ol>
    </div>
  );
};

export default FileTreeNavbar;
