import React, { FunctionComponent } from 'react';
import styles from './Navbar.module.scss';
import cx from 'classnames';
import GoToFileTreeControl from './controls/GoToFileTreeControl';
import GoToPreviewControl from './controls/GoToPreviewControl';
import { useRecoilValue } from 'recoil';
import { appState } from '../../store/app/app.atoms';
import { Breakpoints, Views } from '../../interfaces/AppState.interface';

export type Props = {
  className?: string;
  id?: string;
};
const FileTreeNavbar: FunctionComponent<Props> = ({ id, className }) => {
  const app = useRecoilValue(appState);
  return (
    <div
      id={id}
      className={cx(styles.Navbar, className, {
        [styles.Hide]: app?.breakpoint === Breakpoints.xs,
      })}
    >
      {app?.breakpoint !== Breakpoints.xs && (
        <ol className={cx(styles.ControlsList, styles.ControlsListIsCenter)}>
          {app?.breakpoint === Breakpoints.sm &&
            !app.inView?.includes(
              Views.filetree
            ) /* filetree is not visible yet */ && (
              <li>
                <GoToFileTreeControl />
              </li>
            )}
          <li>{/*<SwitchEditorModeControl />*/}</li>
          {app?.breakpoint === Breakpoints.sm &&
            !app.inView?.includes(
              Views.preview
            ) /* preview is not visible yet */ && (
              <li>
                <GoToPreviewControl />
              </li>
            )}
        </ol>
      )}
    </div>
  );
};

export default FileTreeNavbar;
