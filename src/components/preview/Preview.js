import React, { useContext } from 'react';
import { GlobalContext } from '../../context/global.context';
import styles from './Preview.module.css';

function Preview(props) {
  const [globalContext] = useContext(GlobalContext);
  return (
    <div
      className={styles.Preview}
      dangerouslySetInnerHTML={{ __html: globalContext.html }}
    ></div>
  );
}

export default Preview;
