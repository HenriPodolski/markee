import React, { FunctionComponent } from 'react';
import styles from './Navbar.module.scss';
import SyncFilesControl from './controls/SyncFilesControl';
import NewFolderControl from './controls/NewFolderControl';
import NewFileControl from './controls/NewFileControl';
import SettingsControl from './controls/SettingsControl';
import cx from 'classnames';
import DeleteControl from './controls/DeleteControl';
import GoToEditorControl from './controls/GoToEditorControl';
import { useRecoilValue } from 'recoil';
import { appState } from '../../store/app/app.atoms';
import { Breakpoints } from '../../interfaces/AppState.interface';

export type Props = {
  id?: string;
  className?: string;
};
const FileTreeNavbar: FunctionComponent<Props> = ({ id, className }) => {
  const app = useRecoilValue(appState);
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
        {app?.breakpoint === Breakpoints.xs && (
          <li>
            <GoToEditorControl />
          </li>
        )}
        {/*<li>*/}
        {/*  <SettingsControl />*/}
        {/*</li>*/}
      </ol>
    </div>
  );
};

export default FileTreeNavbar;
