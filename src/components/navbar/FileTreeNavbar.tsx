import React, { FunctionComponent } from 'react';
import styles from './Navbar.module.scss';
import SaveFileControl from './controls/SaveFileControl';
import NewFolderControl from './controls/NewFolderControl';
import NewFileControl from './controls/NewFileControl';
import SettingsControl from './controls/SettingsControl';
import cx from 'classnames';
import DeleteControl from './controls/DeleteControl';
import GoToEditorControl from './controls/GoToEditorControl';

export type Props = {
  id?: string;
  className?: string;
};
const FileTreeNavbar: FunctionComponent<Props> = ({ id, className }) => {
  return (
    <div id={id} className={cx(styles.Navbar, className)}>
      <ol className={styles.ControlsList}>
        <li>
          <NewFileControl />
        </li>
        <li>
          <NewFolderControl />
        </li>
        {/*<li>*/}
        {/*  <SaveFileControl />*/}
        {/*</li>*/}
        <li>
          <DeleteControl />
        </li>
        <li>
          <GoToEditorControl />
        </li>
        {/*<li>*/}
        {/*  <SettingsControl />*/}
        {/*</li>*/}
      </ol>
    </div>
  );
};

export default FileTreeNavbar;
