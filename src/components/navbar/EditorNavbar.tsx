import React, { FunctionComponent } from 'react';
import styles from './Navbar.module.scss';
import cx from 'classnames';
// import SwitchEditorModeControl from './controls/SwitchEditorModeControl';
import EditorToolbar from '../editor/EditorToolbar';
import GoToFileTreeControl from './controls/GoToFileTreeControl';
import GoToPreviewControl from './controls/GoToPreviewControl';

export type Props = {
  className?: string;
  id?: string;
};
const FileTreeNavbar: FunctionComponent<Props> = ({ id, className }) => {
  return (
    <div id={id} className={cx(styles.Navbar, className)}>
      <ol className={styles.ControlsList}>
        <li>
          <GoToFileTreeControl />
        </li>
        <li>
          <EditorToolbar />
        </li>
        <li>
          <GoToPreviewControl />
        </li>
        <li>{/*<SwitchEditorModeControl />*/}</li>
      </ol>
    </div>
  );
};

export default FileTreeNavbar;
