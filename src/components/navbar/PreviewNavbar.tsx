import React, { FunctionComponent } from 'react';
import styles from './Navbar.module.scss';
import SaveFileControl from './controls/SaveFileControl';
import NewFolderControl from './controls/NewFolderControl';
import NewFileControl from './controls/NewFileControl';
import SettingsControl from './controls/SettingsControl';
import cx from 'classnames';

export type Props = {
  className?: string;
  id?: string;
};
const FileTreeNavbar: FunctionComponent<Props> = ({ id, className }) => {
  return (
    <div id={id} className={cx(styles.Navbar, className)}>
      <ol className={styles.ControlsList}>
        <li>
          <SaveFileControl />
        </li>
        <li>
          <NewFolderControl />
        </li>
        <li>
          <NewFileControl />
        </li>
        <li>
          <SettingsControl />
        </li>
      </ol>
    </div>
  );
};

export default FileTreeNavbar;
