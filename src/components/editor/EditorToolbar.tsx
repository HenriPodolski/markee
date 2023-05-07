import React, { useState, MouseEvent } from 'react';
import styles from './EditorToolbar.module.scss';

export const EditorToolbar = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogButtonClick = (evt: MouseEvent) => {
    evt.stopPropagation();
    setDialogOpen(!dialogOpen);
  };

  return (
    <div className={styles.EditorToolbar}>
      Default editor buttons
      <div>
        <button onClick={handleDialogButtonClick}>
          {!dialogOpen ? 'More' : 'Less'}
        </button>
      </div>
      <dialog open={dialogOpen}>Additional editor buttons</dialog>
    </div>
  );
};

export default EditorToolbar;
