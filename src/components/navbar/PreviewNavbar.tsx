import React, { FunctionComponent } from 'react';
import styles from './Navbar.module.scss';
import SaveFileControl from './controls/SaveFileControl';
import NewFolderControl from './controls/NewFolderControl';
import NewFileControl from './controls/NewFileControl';
import SettingsControl from './controls/SettingsControl';
import cx from 'classnames';
import { ReactComponent as MarkeeLogo } from '../../icons/markee-logo.svg';

export type Props = {
  className?: string;
  id?: string;
};
const FileTreeNavbar: FunctionComponent<Props> = ({ id, className }) => {
  return (
    <div id={id} className={cx(styles.Navbar, className)}>
      <ol className={cx(styles.ControlsList, styles.ControlsListHasLogo)}>
        <li className={styles.Logo}>
          <MarkeeLogo />
          /mɑrˈkiː/
        </li>
      </ol>
    </div>
  );
};

export default FileTreeNavbar;
