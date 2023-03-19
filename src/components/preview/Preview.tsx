import React from 'react';
import styles from './Preview.module.scss';
import cx from 'classnames';
import { useRecoilValue } from 'recoil';
import { openFileState } from '../../store/openFile/openFile.atoms';

export type Props = {
  className: string;
};

const Preview: React.FC<Props> = ({ className }: Props) => {
  const openFile = useRecoilValue(openFileState);
  return (
    <div
      className={cx(styles.Preview, className)}
      dangerouslySetInnerHTML={{ __html: openFile?.content ?? '' }}
    ></div>
  );
};

export default Preview;
