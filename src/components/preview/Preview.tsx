import React, { FunctionComponent } from 'react';
import styles from './Preview.module.scss';
/* eslint import/no-webpack-loader-syntax: off */
import rootStyles from '!!raw-loader!./PreviewRoot.module.css';
import cx from 'classnames';
import { useRecoilValue } from 'recoil';
import { openFileState } from '../../store/openFile/openFile.atoms';
import root from 'react-shadow';

export type Props = {
  className: string;
};

const Preview: FunctionComponent<Props> = ({ className }: Props) => {
  const openFile = useRecoilValue(openFileState);
  return (
    <root.div className={cx(styles.Preview, className)}>
      <div
        className="PreviewInner"
        dangerouslySetInnerHTML={{ __html: openFile?.content ?? '' }}
      />
      <style>{rootStyles}</style>
    </root.div>
  );
};

export default Preview;
