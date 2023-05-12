import React, { FunctionComponent } from 'react';
import styles from './Controls.module.scss';
import { ReactComponent as EditorIcon } from '../../../icons/pencil.svg';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';

const GoToEditorControl: FunctionComponent = () => {
  const { t } = useTranslation('navbar');

  const onButtonClick = async () => {
    const editorElement = document.getElementById('editor');
    const splitViewElement = document.getElementById('split-view-section');
    if (editorElement && splitViewElement) {
      splitViewElement.scrollTo({
        left: editorElement.offsetLeft,
        behavior: 'auto',
      });
    }
  };

  return (
    <button
      className={cx(styles.ControlButton, styles.ControlButtonIsIconButton)}
      type="button"
      onClick={onButtonClick}
    >
      <EditorIcon />
      {t('editor-view-button-label')}
    </button>
  );
};

export default GoToEditorControl;
