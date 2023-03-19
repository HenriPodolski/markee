import React, { useContext } from 'react';
import { GlobalContext } from '../../context/global.context';
import styles from './Preview.module.scss';
import cx from 'classnames';

export type Props = {
  className: string;
};

const Preview: React.FC<Props> = ({ className }: Props) => {
  // Todo use selector of open file content that converts content
  // to HTML
  const [globalContext] = useContext(GlobalContext);
  return (
    <div
      className={cx(styles.Preview, className)}
      dangerouslySetInnerHTML={{ __html: globalContext.html }}
    ></div>
  );
};

export default Preview;
