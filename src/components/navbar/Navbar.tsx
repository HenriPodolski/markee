import React from 'react';
import styles from './Navbar.module.scss';
import SaveFileControl from './controls/SaveFileControl';
import NewFolderControl from './controls/NewFolderControl';
import NewFileControl from './controls/NewFileControl';
import SettingsControl from './controls/SettingsControl';

const Navbar: React.FC = () => {
  return (
    <div className={styles.Navbar}>
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

export default Navbar;
