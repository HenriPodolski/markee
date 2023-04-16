import React, { FunctionComponent } from 'react';
import styles from './Navbar.module.scss';
import SaveFileControl from './controls/SaveFileControl';
import NewFolderControl from './controls/NewFolderControl';
import NewFileControl from './controls/NewFileControl';
import SettingsControl from './controls/SettingsControl';
import cx from 'classnames';
import SwitchEditorModeControl from './controls/SwitchEditorModeControl';

export type Props = {
  className?: string;
};
const FileTreeNavbar: FunctionComponent<Props> = ({ className }) => {
  return (
    <div className={cx(styles.Navbar, className)}>
      <ol className={styles.ControlsList}>
        <li>
          <SwitchEditorModeControl />
        </li>
      </ol>
    </div>
  );
};

export default FileTreeNavbar;
